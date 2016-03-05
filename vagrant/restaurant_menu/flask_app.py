from flask import Flask, render_template, url_for, redirect, flash, jsonify,make_response
from flask import request
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from database_setup import Base, Restaurant, MenuItem
import time
app = Flask(__name__)

engine = create_engine('postgresql://vagrant:vagrantvm@localhost:5432/restaurant')
Base.metadata.bind = engine
DBSession = sessionmaker(bind=engine)
session = DBSession()


@app.route('/')
@app.route('/restaurants')
def restaurants():
    try:
        restaurants = session.query(Restaurant).all()
        return render_template('restaurants.html', restaurants=restaurants, time=time)
    except Exception as inst:
        print(type(inst))
        print(inst.args)
        print(inst)


@app.route('/restaurants/new', methods=['GET', 'POST'])
def newRestaurant():
    try:
        if request.method == 'GET':
            return render_template('newrestaurant.html')
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


@app.route('/restaurants/<int:restaurant_id>/')
def restaurantMenu(restaurant_id):
    try:
        restaurant = session.query(Restaurant).filter_by(id=restaurant_id).one()
        items = session.query(MenuItem).filter_by(restaurant_id=restaurant.id)
        return render_template('menu.html', restaurant=restaurant, items=items, time=time)
    except Exception as inst:
        print(type(inst))
        print(inst.args)
        print(inst)

# Task 1: Create route for newMenuItem function here

@app.route('/restaurants/<int:restaurant_id>/menu/new',methods=['GET','POST'])
def newMenuItem(restaurant_id):
    try:
        if request.method == 'GET':
            return render_template('newmenuitem.html', restaurant_id=restaurant_id)
        if request.method == 'POST':
            menuItem = MenuItem()
            menuItem.name = request.form['name']
            print(menuItem)
            menuItem.description = request.form['description']
            menuItem.course = request.form['course']
            menuItem.price = request.form['price']
            menuItem.restaurant_id = restaurant_id
            session.add(menuItem)
            session.commit()

            flash("new menu item created!")
            return jsonify(NewItem=[menuItem.serialize])
    except Exception as inst:
        print(type(inst))
        print(inst.args)
        print(inst)



# Task 2: Create route for editMenuItem function here
@app.route('/restaurants/<int:restaurant_id>/<int:menu_id>/edit',methods=['GET','POST'])
def editMenuItem(restaurant_id, menu_id):
    try:
        if request.method == 'GET':
            restaurant = session.query(Restaurant).filter_by(id=restaurant_id).one()
            item = session.query(MenuItem).filter_by(id=menu_id).one()
            return render_template('editmenuitem.html', restaurant=restaurant, item=item)
        if request.method == 'POST':
            menuItem = session.query(MenuItem).filter_by(id=menu_id).one()
            menuItem.name = request.form['name']
            menuItem.description = request.form['description']
            menuItem.course = request.form['course']
            menuItem.price = request.form['price']
            session.add(menuItem)
            session.commit()
            flash("Menu item edited!")
            return redirect(url_for('restaurantMenu', restaurant_id=restaurant_id))
    except Exception as inst:
        print(type(inst))
        print(inst.args)
        print(inst)


# Task 3: Create a route for deleteMenuItem function here
@app.route('/restaurants/<int:restaurant_id>/<int:menu_id>/delete', methods=['GET', 'POST'])
def deleteMenuItem(restaurant_id, menu_id):
    try:
        if request.method == 'GET':
            item = session.query(MenuItem).filter_by(id=menu_id).one()
            return render_template('deletemenuitem.html', item=item, restaurant_id=restaurant_id)
        if request.method == 'POST':
            menuItem = session.query(MenuItem).filter_by(id=menu_id).one()
            session.delete(menuItem)
            session.commit()
            restaurant = session.query(Restaurant).filter_by(id=restaurant_id).one()
            items = session.query(MenuItem).filter_by(restaurant_id=restaurant.id)
            return jsonify(MenuItems=[i.serialize for i in items])
    except Exception as inst:
        print(type(inst))
        print(inst.args)
        print(inst)



@app.route('/restaurants/JSON')
def restaurantSJSON():
    try:
        restaurants = session.query(Restaurant).all()
        return jsonify(restaurants=[restaurant.serialize for restaurant in restaurants])
    except Exception as inst:
        print(type(inst))
        print(inst.args)
        print(inst)


@app.route('/restaurants/<int:restaurant_id>/menu/JSON')
def restaurantMenuJSON(restaurant_id):
    try:
        restaurant = session.query(Restaurant).filter_by(id=restaurant_id).one()
        items = session.query(MenuItem).filter_by(restaurant_id=restaurant.id)
        return jsonify(MenuItems=[i.serialize for i in items])
    except Exception as inst:
        print(type(inst))
        print(inst.args)
        print(inst)


@app.route('/restaurants/<int:restaurant_id>/menu/<int:menu_id>/JSON')
def menuItemJSON(restaurant_id, menu_id):
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