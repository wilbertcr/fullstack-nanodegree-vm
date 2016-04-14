#!/usr/bin/python
"""
Main flask application code.
"""
import json
import os
import random
import string
import sys
import time

import httplib2
import requests
from flask import Flask, render_template, jsonify, make_response
from flask import request
from flask import session as login_session
from oauth2client.client import AccessTokenCredentials
from oauth2client.client import FlowExchangeError
from oauth2client.client import flow_from_clientsecrets
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.orm.exc import NoResultFound, MultipleResultsFound
from werkzeug.utils import secure_filename
from config.sql_alchemy_setup import Base, User, Category, Item

# Pybuilder needs to know where the root of all packages is so we need to set path to it here.
# as it picks it up from it.
sys.path.insert(0, '../')

app = Flask(__name__)
APPLICATION_NAME = "Catalog App"
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif'}

engine = create_engine('postgresql://vagrant:vagrantvm@localhost:5432/catalog')
Base.metadata.bind = engine
DBSession = sessionmaker(bind=engine)
session = DBSession()

secrets_path = './client_secrets.json'
CLIENT_ID = json.loads(
    open(secrets_path, 'r').read()
)['web']['client_id']


@app.route('/')
@app.route('/index')
def show_login():
    state = get_new_state()
    login_session['state'] = state
    # "Current sessions state {0}".format(login_session['state'])
    return render_template('index.html', time=time, STATE=state)


@app.route('/gconnect', methods=['POST'])
def gconnect():
    """
    This route deals with logging in a user using googleAuth2
    and getting basic profile information from google about the
    user.
    """
    # Validate that the state token we sent and the one we received are the same.
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
        state = get_new_state()
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

    # Get user info
    userinfo_url = "https://www.googleapis.com/oauth2/v1/userinfo"
    params = {'access_token': credentials.access_token, 'alt': 'json'}
    answer_json = requests.get(userinfo_url, params=params).json()

    login_session['username'] = answer_json['name']
    login_session['picture'] = answer_json['picture']
    login_session['email'] = answer_json['email']

    # see if user exists, otherwise create a new one.
    user_id = get_user_id(answer_json['email'])
    if not user_id:
        user_id = create_user()
    login_session['user_id'] = user_id

    # Our response will include a new nonce.
    state = get_new_state()
    login_session['state'] = state
    response = make_response(
        json.dumps({'success': 'User connected', 'nonce': login_session['state']}), 200
    )
    response.headers['Content-Type'] = 'application/json'
    return response


@app.route('/gdisconnect')
def gdisconnect():
    # Verify that the nonce received is valid.
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
            json.dumps({'error': 'Current user not connected.'}), 404
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
        state = get_new_state()
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
        state = get_new_state()
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
            state = get_new_state()
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
            state = get_new_state()
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
            category = session.query(Category).filter_by(id=category_id).all()
            if len(category) > 0:
                state = get_new_state()
                login_session['state'] = state
                category = category[0]
                category.name = request.form['name']
                session.add(category)
                session.commit()
                response = make_response(
                    json.dumps({'Success': '', 'nonce': login_session['state']}), 200
                )
                response.headers['Content-Type'] = 'application/json'
                return response
            else:
                return make_response(jsonify(error=["No results found"]), 404)
    except Exception as inst:
        print(type(inst))
        print(inst.args)
        print(inst)


@app.route('/items/add', methods=['POST'])
def add_item():
    """
    Adds an item to the database.
    """
    if 'username' not in login_session:
        response = make_response(
            json.dumps({'error': 'User is logged out. This should not happen'}), 401
        )
        response.headers['Content-Type'] = 'application/json'
        return response
    try:
        if request.method == 'POST':
            item = Item()
            # First we populate the new item.
            item.category_id = request.form['categoryId']
            item.picture = request.form['picture']
            item.name = request.form['name']
            item.price = request.form['price']
            item.description = request.form['description']
            item.user_id = login_session['user_id']
            # Now let's pull its category.
            category = session.query(Category).filter_by(id=item.category_id).one()
            # And make sure they're properly linked.
            item.category = category
            session.add(item)
            session.commit()
            response = make_response(
                json.dumps({'Success': '', 'nonce': login_session['state']}), 200
            )
            response.headers['Content-Type'] = 'application/json'
            return response
    except Exception as inst:
        print(type(inst))
        print(inst.args)
        print(inst)


@app.route('/items/edit/<int:item_id>', methods=['POST'])
def edit_item(item_id):
    """
    Edits an item's contents based on the information submitted by the form.
    """
    if 'username' not in login_session:
        response = make_response(
            json.dumps({'error': 'User is logged out. This should not happen'}), 401
        )
        response.headers['Content-Type'] = 'application/json'
        return response
    try:
        if request.method == 'POST':
            item = session.query(Item).filter_by(id=item_id).one()
            item.picture = request.form['picture']
            item.name = request.form['name']
            item.price = request.form['price']
            item.description = request.form['description']
            item.user_id = login_session['user_id']
            session.add(item)
            session.commit()
            response = make_response(
                json.dumps({'Success': '', 'nonce': login_session['state']}), 200
            )
            response.headers['Content-Type'] = 'application/json'
            return response
    except Exception as inst:
        print(type(inst))
        print(inst.args)
        print(inst)


@app.route('/items/delete/<int:item_id>', methods=['DELETE'])
def delete_item(item_id):
    """
    Deletes an item.
    """
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
            item = session.query(Item).filter_by(id=item_id).one()
            session.delete(item)
            session.commit()
            state = get_new_state()
            login_session['state'] = state
            response = make_response(
                json.dumps({'Success': '', 'nonce': login_session['state']}), 200
            )
            response.headers['Content-Type'] = 'application/json'
            return response
    except Exception as inst:
        print(type(inst))
        print(inst.args)
        print(inst)


@app.route('/static/images/<string:image_name>', methods=['POST'])
def store_image(image_name):
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
            received_file = request.files['picture_file']
            if received_file and allowed_file(received_file.filename):
                filename = secure_filename(received_file.filename)
                full_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
                received_file.save(full_path)
                state = get_new_state()
                login_session['state'] = state
                response = make_response(
                    json.dumps({
                        'path': request.path,
                        'success': '',
                        'nonce': login_session['state']
                    }),
                    200
                )
                response.headers['Content-Type'] = 'application/json'
                return response
    except Exception as inst:
        app.logger.error(type(inst))
        app.logger.error(inst.args)
        app.logger.error(inst)


def info(object, spacing=10, collapse=1):
    """Print methods and doc strings.
    Takes module, class, list, dictionary, or string."""
    method_list = [e for e in dir(object) if callable(getattr(object, e))]
    process_func = collapse and (lambda s: " ".join(s.split())) or (lambda s: s)
    return "\n".join(["%s %s" %
                     (method.ljust(spacing),
                      process_func(str(getattr(object, method).__doc__)))
                     for method in method_list])


def get_user_id(email):
    """
    Given an email address, it returns the user_id associated with it.
    Args:
        email (str): An email address
    Returns:
        int: If successful, it returns the user_id related to the email address received. Otherwise it returns -1
    """
    try:
        user = session.query(User).filter_by(email=email).one()
        return user.id
    except NoResultFound:
        app.logger.warning("Search by email returned no results.")
        return -1
    except MultipleResultsFound:
        app.logger.error("Search by email returned multiple results.")
        return -1


def get_user_info(user_id):
    """
    Returns a User object.
    Args:
        user_id(int): The user id.
    Returns:
        user(object): A user, containing id, name, email, picture attributes.
    """
    user = session.query(User).filter_by(id=user_id).one()
    return user


def create_user():
    """
    Stores user's information in the database.
    Returns:
        int: The user id.
    """
    new_user = User(id=login_session['gplus_id'],
                    name=login_session['username'],
                    email=login_session['email'],
                    picture=login_session['picture'])
    session.add(new_user)
    session.flush()
    session.commit()
    user = session.query(User).filter_by(email=login_session['email']).one()
    return user.id


def get_new_state():
    """The 'state' is used as a nonce. It is sent to the client when the page is rendered
    and it is required on next request. Not all requests use it, but those altering data do.
    Nonce is refreshed on each interaction on which is requested, client needs to make sure it is
    updated.
    """
    state = ''.join(random.choice(string.ascii_uppercase + string.digits) for x in xrange(32))
    return state


# http://flask.pocoo.org/docs/0.10/patterns/fileuploads/
def allowed_file(filename):
    """
    Args:
        filename(str): The name of the file.
    Returns:
        bool: True if the file's extension is allowed, false otherwise.
    """
    return '.' in filename and \
           filename.rsplit('.', 1)[1] in ALLOWED_EXTENSIONS

if __name__ == '__main__':
    app.secret_key = 'super_secret_key'
    app.debug = True
    app.config['UPLOAD_FOLDER'] = './static/images/'
    app.run(host='0.0.0.0', port=5000)
