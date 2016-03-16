#!/usr/bin/python
"""
Main flask application code.
"""
from flask import Flask, render_template, url_for, jsonify, make_response
from flask import request
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from config.database_setup import Base, Restaurant, MenuItem
from pydoc import help
import time
import sys
sys.path.insert(0, '../')

app = Flask(__name__)
engine = create_engine('postgresql://vagrant:vagrantvm@localhost:5432/restaurant')
Base.metadata.bind = engine
DBSession = sessionmaker(bind=engine)
session = DBSession()


# Main page.
@app.route('/')
@app.route('/restaurants')
def restaurants():
    '''
    Renders main page.
    Returns: restaurants.html
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
