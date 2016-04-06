#!/usr/bin/python
"""
Main flask application code.
"""
from flask import Flask, render_template, url_for, jsonify, make_response
from flask import request, redirect
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from config.sql_alchemy_setup import Base, User, Category, Item
from flask import session as login_session
from oauth2client.client import flow_from_clientsecrets
#Exception used to catch erros occurred during flow exchanges.
from oauth2client.client import FlowExchangeError
from oauth2client.client import AccessTokenCredentials
import httplib2
import requests
import json
import random
import string
import time
import sys


#Pybuilder needs to know where the root of all packages is so we need to set path to it here.
#as it picks it up from it.
sys.path.insert(0, '../')

APPLICATION_NAME = "Catalog App"

app = Flask(__name__)
engine = create_engine('postgresql://vagrant:vagrantvm@localhost:5432/catalog')
Base.metadata.bind = engine
DBSession = sessionmaker(bind=engine)
session = DBSession()

secrets_path = 'src/backend/python/client_secrets.json'
CLIENT_ID = json.loads(
    open(secrets_path, 'r').read()
)['web']['client_id']


@app.route('/')
@app.route('/index')
def show_login():
    state = ''.join(random.choice(string.ascii_uppercase+string.digits) for x in xrange(32))
    login_session['state'] = state
    #"Current sessions state {0}".format(login_session['state'])
    return render_template('index.html', time=time, STATE=state)


@app.route('/gconnect', methods=['POST'])
def gconnect():
    i = 0
    # Validate that the state token we sent and the one we received are the same.
    app.logger.warning("Received state: "+request.args.get('state'))
    app.logger.warning("Current state: "+login_session['state'])
    if request.args.get('state') != login_session['state']:
        response = make_response(
            json.dumps({
                'error': 'Invalid state parameter',
                'expected': login_session['state']
            }),
            401
        )
        response.headers['Content-Type'] = 'application/json'
        return response
    # Obtain authorization code(it was sent to us by google.)
    code = request.data
    try:
        # Upgrade the authorization code into a credentials object.
        # flow_from_client_secrets(client_secret file_path,scope='')
        # creates a flow object using the client's secret file.
        oauth_flow = flow_from_clientsecrets(secrets_path, scope='')
        oauth_flow.redirect_uri = 'postmessage'
        credentials = oauth_flow.step2_exchange(code)
    except FlowExchangeError:
        response = make_response(
            json.dumps({'error': 'Failed to upgrade the authorization code'}), 401
        )
        response.headers['Content-Type'] = 'application/json'
        return response

    # Let's check that the access token is valid.
    access_token = credentials.access_token
    url = ('https://www.googleapis.com/oauth2/v1/tokeninfo?access_token=%s' % access_token)
    h = httplib2.Http()
    result = json.loads(h.request(url, 'GET')[1])
    # If we get an error, we abort.
    if result.get('error') is not None:
        response = make_response(json.dumps({'error': result.get('error')}), 500)
        response.headers['Content-Type'] = 'application/json'
        return response

    # Verify that the access token is used for the intended user.
    gplus_id = credentials.id_token['sub']
    if result['user_id'] != gplus_id:
        response = make_response(
            json.dumps({'error': 'Token user IDs do not match apps'}), 401
        )
        response.headers['Content-Type'] = 'application/json'
        return response

    # Verify that the access token is valid for this app.
    if result['issued_to'] != CLIENT_ID:
        response = make_response(
            json.dumps({'error': 'Token client IDs do not match apps'}), 401
        )
        response.headers['Content-Type'] = 'application/json'
        return response

    # Is the user already logged in?
    stored_access_token = login_session.get('access_token')
    stored_gplus_id = login_session.get('gplus_id')
    if stored_access_token is not None and gplus_id == stored_gplus_id:
        # Our response will include a new nonce.
        state = ''.join(random.choice(string.ascii_uppercase+string.digits) for x in xrange(32))
        login_session['state'] = state
        response = make_response(
            json.dumps({'success': 'User already connected', 'nonce': login_session['state']}), 200
        )
        response.headers['Content-Type'] = 'application/json'
        return response

    # Store the access token in the session for later user.
    login_session['provider'] = 'google'
    login_session['access_token'] = credentials.access_token
    credentials = AccessTokenCredentials(login_session['access_token'], 'user-agent-value')
    login_session['gplus_id'] = gplus_id

    #Get user info
    userinfo_url = "https://www.googleapis.com/oauth2/v1/userinfo"
    params = {'access_token': credentials.access_token, 'alt': 'json'}
    answer = requests.get(userinfo_url, params=params)
    answer_json = answer.json()

    login_session['username'] = answer_json['name']
    login_session['picture'] = answer_json['picture']
    login_session['email'] = answer_json['email']

    # see if user exists, otherwise create a new one.
    user_id = get_user_id(answer_json['email'])
    if not user_id:
        user_id = create_user(login_session)
    login_session['user_id'] = user_id

    # Our response will include a new nonce.
    state = ''.join(random.choice(string.ascii_uppercase+string.digits) for x in xrange(32))
    login_session['state'] = state
    response = make_response(
        json.dumps({'success': 'User connected', 'nonce': login_session['state']}), 200
    )
    response.headers['Content-Type'] = 'application/json'
    return response


@app.route('/gdisconnect')
def gdisconnect():
    if request.args.get('state') != login_session['state']:
        response = make_response(
            json.dumps({'error': 'Invalid state parameter'}), 401
        )
        response.headers['Content-Type'] = 'application/json'
        return response
    # Only disconnect a connected user.
    access_token = login_session.get('access_token')
    if access_token is None:
        app.logger.warning("User was not connected.")
        response = make_response(
            json.dumps('Current user not connected.'), 401
        )
        response.headers['Content-Type'] = 'application/json'
        return response

    # Execute HTTP GET request to revoke current token.
    url = 'https://accounts.google.com/o/oauth2/revoke?token=%s' % access_token
    h = httplib2.Http()
    result = h.request(url, 'GET')[0]

    if result['status'] == '200':
        # Reset the user's session
        del login_session['provider']
        del login_session['access_token']
        del login_session['gplus_id']
        del login_session['username']
        del login_session['email']
        del login_session['picture']
        # Our response will include a new nonce.
        state = ''.join(random.choice(string.ascii_uppercase + string.digits) for x in xrange(32))
        login_session['state'] = state
        response = make_response(
            json.dumps({'success': 'User disconnected', 'nonce': login_session['state']}), 200
        )
        response.headers['Content-Type'] = 'application/json'
        return response
    elif result['status'] == '400':
        del login_session['provider']
        del login_session['access_token']
        del login_session['gplus_id']
        del login_session['username']
        del login_session['email']
        del login_session['picture']
        # Our response will include a new nonce.
        state = ''.join(random.choice(string.ascii_uppercase + string.digits) for x in xrange(32))
        login_session['state'] = state
        response = make_response(
            json.dumps({'success': 'User was already disconnected', 'nonce': login_session['state']}), 200
        )
        response.headers['Content-Type'] = 'application/json'
        return response
    else:
        response = make_response(
            json.dumps("Error: "+result['status']), 401
        )
        response.headers['Content-Type'] = 'application/json'
        return response


@app.route('/categories/json')
def categories_json():
    try:
        app.logger.warning("State sent back: "+login_session['state'])
        categories = session.query(Category).all()
        return jsonify(categories=[category.serialize for category in categories])
    except Exception as inst:
        print(type(inst))
        print(inst.args)
        print(inst)

@app.route('/categories/new', methods=['POST'])
def add_category():
    if request.args.get('state') != login_session['state']:
        response = make_response(
            json.dumps({'error': 'Invalid state parameter.'}), 401
        )
        response.headers['Content-Type'] = 'application/json'
        return response
    if 'username' not in login_session:
        response = make_response(
            json.dumps({'error': 'User is logged out. This should not happen'}), 401
        )
        response.headers['Content-Type'] = 'application/json'
        return response
    try:
        if request.method == 'POST':
            category = Category()
            category.name = request.form['name']
            state = ''.join(random.choice(string.ascii_uppercase + string.digits) for x in xrange(32))
            login_session['state'] = state
            session.add(category)
            # flush() allows me to see the id that will be
            # assigned upon comitting the session.
            session.flush()
            response = make_response(
                json.dumps({'category': category.serialize, 'nonce': login_session['state']}), 200
            )
            response.headers['Content-Type'] = 'application/json'
            session.commit()
            return response
    except Exception as inst:
        print(type(inst))
        print(inst.args)
        print(inst)


@app.route('/categories/delete/<int:category_id>', methods=['DELETE'])
def delete_category(category_id):
    if request.args.get('state') != login_session['state']:
        response = make_response(
            json.dumps({'error': 'Invalid state parameter.'}), 401
        )
        response.headers['Content-Type'] = 'application/json'
        return response
    if 'username' not in login_session:
        response = make_response(
            json.dumps({'error': 'User is logged out. This should not happen'}), 401
        )
        response.headers['Content-Type'] = 'application/json'
        return response
    try:
        if request.method == 'DELETE':
            category = session.query(Category).filter_by(id=category_id).one()
            session.delete(category)
            session.commit()
            state = ''.join(random.choice(string.ascii_uppercase + string.digits) for x in xrange(32))
            login_session['state'] = state
            response = make_response(
                json.dumps({'success': '', 'nonce': login_session['state']}), 200
            )
            response.headers['Content-Type'] = 'application/json'
            return response
    except Exception as inst:
        print(type(inst))
        print(inst.args)
        print(inst)


@app.route('/categories/edit/<int:category_id>', methods=['POST'])
def edit_category(category_id):
    if request.args.get('state') != login_session['state']:
        response = make_response(
            json.dumps({'error':'Invalid state parameter.'}), 401
        )
        response.headers['Content-Type'] = 'application/json'
        return response
    if 'username' not in login_session:
        response = make_response(
            json.dumps({'error': 'User is logged out. This should not happen'}), 401
        )
        response.headers['Content-Type'] = 'application/json'
        return response
    try:
        if request.method == 'POST':
            category = session.query(Category).filter_by(id=category_id).all()
            if len(category) > 0:
                state = ''.join(random.choice(string.ascii_uppercase+string.digits) for x in xrange(32))
                login_session['state'] = state
                category = category[0]
                category.name = request.form['name']
                session.add(category)
                session.commit()
                response = make_response(
                    json.dumps({'Success': '','nonce': login_session['state']}), 200
                )
                response.headers['Content-Type'] = 'application/json'
                return response
            else:
                return make_response(jsonify(error=["No results found"]), 404)
    except Exception as inst:
        print(type(inst))
        print(inst.args)
        print(inst)


def get_user_id(email):
    try:
        user = session.query(User).filter_by(email=email).one()
        return user.id
    except:
        return None


def get_user_info(user_id):
    user = session.query(User).filter_by(id=user_id).one()
    return user


def create_user(login_session):
    new_user = User(id=login_session['gplus_id'],
                   name=login_session['username'],
                   email=login_session['email'],
                   picture=login_session['picture'])
    session.add(new_user)
    session.flush()
    session.commit()
    user = session.query(User).filter_by(email=login_session['email']).one()
    return user.id


if __name__ == '__main__':
    app.secret_key = 'super_secret_key'
    app.debug = True
    app.run(host='0.0.0.0', port=5000)
