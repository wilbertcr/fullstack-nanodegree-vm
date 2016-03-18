#!/usr/bin/python
"""
Main flask application code.
"""
from flask import Flask, render_template, url_for, jsonify, make_response
from flask import request
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from config.sql_alchemy_setup import Base, Restaurant, MenuItem
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
import logging
sys.path.insert(0, '../')

secrets_path = 'src/backend/python/client_secrets.json'
CLIENT_ID = json.loads(
    open(secrets_path, 'r').read())['web']['client_id']
APPLICATION_NAME = "Restaurant Menu App"

app = Flask(__name__)
engine = create_engine('postgresql://vagrant:vagrantvm@localhost:5432/restaurant')
Base.metadata.bind = engine
DBSession = sessionmaker(bind=engine)
session = DBSession()


@app.route('/login')
def showLogin():
    state = ''.join(random.choice(string.ascii_uppercase+string.digits) for x in xrange(32))
    login_session['state'] = state
    #"Current sessions state {0}".format(login_session['state'])
    return render_template('login.html',time=time, STATE=state)


@app.route('/gconnect', methods=['POST'])
def gconnect():
    i = 0
    # Validate that the state token we sent and the one we received are the same.
    if request.args.get('state') != login_session['state']:
        response = make_response(
            json.dumps('Invalid state parameter.'), 402
        )
        response.headers['Content-Type'] = 'application/json'
        return response
    #Obtain authorization code(it was sent to us by google.)
    code = request.data
    credentials = {}
    try:
        #Upgrade the authorization code into a credentials object.
        #flow_from_client_secrets(client_secret file_path,scope='')
        #creates a flow object using the client's secret file.
        oauth_flow = flow_from_clientsecrets(secrets_path, scope='')
        oauth_flow.redirect_uri = 'postmessage'
        credentials = oauth_flow.step2_exchange(code)
    except FlowExchangeError:
        response = make_response(
            json.dumps('Failed to upgrade the authorization code'), 401
        )
        response.headers['Content-Type'] = 'application/json'
        return response

    #Let's check that the access token is valid.
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
    stored_credentials = login_session.get('credentials')
    stored_gplus_id = login_session.get('gplus_id')

    if(stored_credentials is not None and gplus_id == stored_gplus_id):
        response = make_response(
            json.dumps('Current user is already connected.'), 200
        )
        response.headers['Content-Type'] = 'application/json'
        return response

    # Store the access token in the session for later user.
    login_session['credentials'] = credentials.access_token
    credentials = AccessTokenCredentials(login_session['credentials'], 'user-agent-value')
    login_session['gplus_id'] = gplus_id

    #Get user info
    userinfo_url = "https://www.googleapis.com/oauth2/v1/userinfo"
    params = {'access_token': credentials.access_token, 'alt': 'json'}
    answer = requests.get(userinfo_url, params=params)

    data = answer.json()

    login_session['username'] = data['name']
    login_session['picture'] = data['picture']
    login_session['email'] = data['email']

    output = ''
    output += '<h1>Welcome, '
    output += login_session['username']
    output += '!</h1>'
    output += '<img src="'
    output += login_session['picture']
    output += ' " style = "width: 300px; height: 300px;border-radius: 150px;-webkit-border-radius: 150px;-moz-border-radius: 150px;"> '
    print("done!")
    return output



# Main page.
@app.route('/')
@app.route('/restaurants')
def restaurants():
    '''
    Renders main page. I'm passing the time function to trick the browser into
    reloading CSS and Javascript every time the page is reloaded. Good for development but must be gone in production.
    '''
    try:
        return render_template('restaurants.html', time=time)
    except Exception as inst:
        print(type(inst))
        print(inst.args)
        print(inst)


# POST: Create new restaurant
@app.route('/restaurants/new', methods=['POST'])
def new_restaurant():
    try:
        if request.method == 'POST':
            restaurant = Restaurant()
            restaurant.name = request.form['name']
            if restaurant.name != "":
                session.add(restaurant)
                session.commit()
                restaurants = session.query(Restaurant).all()
                return jsonify(restaurants=[restaurant.serialize for restaurant in restaurants])
    except Exception as inst:
        print(type(inst))
        print(inst.args)
        print(inst)


@app.route('/restaurants/delete/<int:restaurant_id>', methods=['POST'])
def delete_restaurant(restaurant_id):
    try:
        if request.method == 'POST':
            restaurant = session.query(Restaurant).filter_by(id=restaurant_id).one()
            if restaurant.name != "":
                session.delete(restaurant)
                session.commit()
                restaurants = session.query(Restaurant).all()
                return jsonify(restaurants=[restaurant.serialize for restaurant in restaurants])
            else:
                return make_response(jsonify(error=["Name cannot be empty"]), 500)
    except Exception as inst:
        print(type(inst))
        print(inst.args)
        print(inst)
        return make_response(jsonify(error=["No results found"]), 404)


@app.route('/restaurants/edit/<int:restaurant_id>', methods=['POST'])
def edit_restaurant(restaurant_id):
    try:
        if request.method == 'POST':
            restaurants = session.query(Restaurant).filter_by(id=restaurant_id).all()
            if len(restaurants) > 0:
                restaurant = restaurants[0]
                restaurant.name = request.form['name']
                session.add(restaurant)
                session.commit()
                restaurants = session.query(Restaurant).all()
                return jsonify(restaurants=[restaurant.serialize for restaurant in restaurants])
            else:
                return make_response(jsonify(error=["No results found"]), 404)
    except Exception as inst:
        print(type(inst))
        print(inst.args)
        print(inst)


@app.route('/restaurants/<int:restaurant_id>/menu/JSON')
def restaurant_menu_json(restaurant_id):
    try:
        restaurant = session.query(Restaurant).filter_by(id=restaurant_id).one()
        items = session.query(MenuItem).filter_by(restaurant_id=restaurant.id)
        return jsonify(MenuItems=[i.serialize for i in items])
    except Exception as inst:
        print(type(inst))
        print(inst.args)
        print(inst)


# Task 1: Create route for newMenuItem function here
@app.route('/restaurants/<int:restaurant_id>/menu/new', methods=['POST'])
def new_menu_item(restaurant_id):
    try:
        if request.method == 'POST':
            menu_item = MenuItem()
            menu_item.name = request.form['name']
            print(menu_item)
            menu_item.description = request.form['description']
            menu_item.course = request.form['course']
            menu_item.price = request.form['price']
            menu_item.restaurant_id = restaurant_id
            session.add(menu_item)
            session.commit()
            return jsonify(NewItem=menu_item.serialize)
    except Exception as inst:
        print(type(inst))
        print(inst.args)
        print(inst)


# Task 3: Create a route for deleteMenuItem function here
@app.route('/restaurants/<int:restaurant_id>/delete/<int:menu_id>', methods=['POST'])
def delete_menu_item(restaurant_id, menu_id):
    try:
        if request.method == 'POST':
            menu_item = session.query(MenuItem).filter_by(id=menu_id).one()
            session.delete(menu_item)
            session.commit()
            restaurant = session.query(Restaurant).filter_by(id=restaurant_id).one()
            items = session.query(MenuItem).filter_by(restaurant_id=restaurant.id)
            return jsonify(MenuItems=[i.serialize for i in items])
    except Exception as inst:
        print(type(inst))
        print(inst.args)
        print(inst)


# Task 2: Create route for editMenuItem function here
@app.route('/restaurants/<int:restaurant_id>/<int:menu_id>/edit', methods=['POST'])
def edit_menu_item(restaurant_id, menu_id):
    try:
        if request.method == 'POST':
            menu_item = session.query(MenuItem).filter_by(id=menu_id).one()
            menu_item.name = request.form['name']
            menu_item.description = request.form['description']
            menu_item.course = request.form['course']
            menu_item.price = request.form['price']
            session.add(menu_item)
            session.commit()
            return jsonify(menu_item.serialize)
    except Exception as inst:
        print(type(inst))
        print(inst.args)
        print(inst)


@app.route('/restaurants/JSON')
def restaurants_json():
    try:
        restaurants = session.query(Restaurant).all()
        return jsonify(restaurants=[restaurant.serialize for restaurant in restaurants])
    except Exception as inst:
        print(type(inst))
        print(inst.args)
        print(inst)


@app.route('/restaurants/<int:restaurant_id>/menu/<int:menu_id>/JSON')
def menu_item_json(restaurant_id, menu_id):
    try:
        item = session.query(MenuItem).filter_by(id=menu_id).one()
        return jsonify(MenuItem=[item.serialize])
    except Exception as inst:
        print(type(inst))
        print(inst.args)
        print(inst)


if __name__ == '__main__':
    app.secret_key = 'super_secret_key'
    app.debug = True
    app.run(host='0.0.0.0', port=5000)

