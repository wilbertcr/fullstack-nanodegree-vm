from flask import Flask, render_template, url_for, redirect
from flask import request
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from database_setup import Base, Restaurant, MenuItem

app = Flask(__name__)

engine = create_engine('postgresql://vagrant:vagrantvm@localhost:5432/restaurant')
Base.metadata.bind = engine
DBSession = sessionmaker(bind=engine)
session = DBSession()


@app.route('/')
@app.route('/restaurants/<int:restaurant_id>/')
def restaurantMenu(restaurant_id):
    restaurant = session.query(Restaurant).filter_by(id=restaurant_id).one()
    items = session.query(MenuItem).filter_by(restaurant_id=restaurant.id)
    return render_template('menu.html', restaurant=restaurant, items=items)

# Task 1: Create route for newMenuItem function here

@app.route('/restaurants/<int:restaurant_id>/menu/new',methods=['GET','POST'])
def newMenuItem(restaurant_id):
    try:
        if request.method == 'GET':
            output = ""
            output += '''<form method='POST' enctype='multipart/form-data' action='/restaurants/{0}/menu/new'>'''.format(restaurant_id)
            output += '''<h2>New menu item</h2>'''
            output += '''Name: <input name="name" type="text"><br>'''
            output += '''Description: <input name="description" type="text"><br>'''
            output += '''Price: <input name="price" type="text"><br>'''
            output += '''Course:<input name="course" type="text"><br>'''
            output += '''<input type="submit" value="Submit"> </form>'''
            return output
        if request.method == 'POST':
            menuItem = MenuItem()
            menuItem.name = request.form['name']
            menuItem.description = request.form['description']
            menuItem.course = request.form['course']
            menuItem.price = request.form['price']
            menuItem.restaurant_id = restaurant_id
            session.add(menuItem)
            session.commit()
            return redirect(url_for('restaurantMenu', restaurant_id=restaurant_id))
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
            return redirect(url_for('restaurantMenu', restaurant_id=restaurant_id))
    except Exception as inst:
        print(type(inst))
        print(inst.args)
        print(inst)


# Task 3: Create a route for deleteMenuItem function here
@app.route('/restaurants/<int:restaurant_id>/<int:menu_id>/delete')
def deleteMenuItem(restaurant_id, menu_id):
    return "page to delete a menu item. Task 3 complete!"


if __name__ == '__main__':
    app.debug = True
    app.run(host='0.0.0.0', port=5000)