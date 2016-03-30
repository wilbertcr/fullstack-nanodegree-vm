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
    if request.args.get('state') != login_session['state']:
        response = make_response(
            json.dumps('Invalid state parameter.'), 401
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
            json.dumps('Failed to upgrade the authorization code'), 401
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
        response = make_response(json.dumps(result.get('error')), 500)
        response.headers['Content-Type'] = 'application/json'
        return response

    # Verify that the access token is used for the intended user.
    gplus_id = credentials.id_token['sub']
    if result['user_id'] != gplus_id:
        response = make_response(
            json.dumps('Token user IDs do not match.'), 401
        )
        response.headers['Content-Type'] = 'application/json'
        return response

    # Verify that the access token is valid for this app.
    if result['issued_to'] != CLIENT_ID:
        response = make_response(
            json.dumps('Token client IDs do not match apps'), 401
        )
        response.headers['Content-Type'] = 'application/json'
        return response

    # Is the user already logged in?
    stored_access_token = login_session.get('access_token')
    stored_gplus_id = login_session.get('gplus_id')

    if stored_access_token is not None and gplus_id == stored_gplus_id:
        response = make_response(
            json.dumps('Success. User is already connected.'), 200
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
    user_id = getUserID(answer_json['email'])
    if not user_id:
        user_id = createUser(login_session)
    login_session['user_id'] = user_id

    response = make_response(
        json.dumps('Success'), 200
    )
    response.headers['Content-Type'] = 'application/json'
    return response


@app.route('/gdisconnect')
def gdisconnect():
    # Only disconnect a connected user.
    access_token = login_session.get('access_token')
    if access_token is None:
        app.logger.warning("User was not connected. Sending to login screen.")
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
        response = make_response(
            json.dumps('Successfully disconnected.'), 200
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
        response = make_response(
            json.dumps('Successfully disconnected.'), 200
        )
        response.headers['Content-Type'] = 'application/json'
        return response
    else:
        response = make_response(
            json.dumps("Error: "+result['status']), 401
        )
        response.headers['Content-Type'] = 'application/json'
        return response

def getUserID(email):
    try:
        user = session.query(User).filter_by(email = email).one()
        return user.id
    except:
        return None


def getUserInfo(user_id):
    user = session.query(User).filter_by(id=user_id).one()
    return user


def createUser(login_session):
    newUser = User(name = login_session['username'],
                   email = login_session['email'],
                   picture = login_session['picture'])
    session.add(newUser)
    session.commit()

    user = session.query(User).filter_by(email=login_session['email']).one()
    return user.id


if __name__ == '__main__':
    app.secret_key = 'super_secret_key'
    app.debug = True
    app.run(host='0.0.0.0', port=5000)
