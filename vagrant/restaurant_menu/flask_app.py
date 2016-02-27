from flask import Flask
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
    output = ''
    for i in items:
        output += i.name
        output += '</br>'
        output += i.price
        output += '</br>'
        output += i.description
        output += '</br>'
        output += '</br>'
    return output

# Task 1: Create route for newMenuItem function here

@app.route('/restaurants/<int:restaurant_id>/menu/new')
def newMenuItem(restaurant_id):
    if request.method == 'GET':
        output = ""
        output += '''<form method='POST' enctype='multipart/form-data' action='/restaurants/{0}/menu/add_new'>'''.format(restaurant_id)
        output += '''<h2>New menu item</h2>'''
        output += '''Name: <input name="name" type="text"><br>'''
        output += '''Description: <input name="description" type="text"><br>'''
        output += '''Price: <input name="price" type="text"><br>'''
        output += '''Course:<input name="course" type="text"><br>'''
        output += '''<input type="submit" value="Submit"> </form>'''
        return output


@app.route('/restaurants/<int:restaurant_id>/menu/add_new', methods=['POST'])
def recordMenuItem(restaurant_id):
    try:
        if request.method == 'POST':
            description = request.form['description']
            price = request.form['price']
            course = request.form['course']
            menuItem = MenuItem()
            menuItem.name = request.form['name']
            menuItem.description = request.form['description']
            menuItem.course = request.form['course']
            menuItem.price = request.form['price']
            menuItem.restaurant_id = restaurant_id
            session.add(menuItem)
            session.commit()
            output = ""
            output = "<h3>Stored: {0}<h3>".format(request.form['name'])
            return output
    except Exception as inst:
        print(type(inst))
        print(inst.args)
        print(inst)


# Task 2: Create route for editMenuItem function here
@app.route('/restaurants/<int:restaurant_id>/<int:menu_id>/edit')
def editMenuItem(restaurant_id, menu_id):
    return "page to edit a menu item. Task 2 complete!"

# Task 3: Create a route for deleteMenuItem function here
@app.route('/restaurants/<int:restaurant_id>/<int:menu_id>/delete')
def deleteMenuItem(restaurant_id, menu_id):
    return "page to delete a menu item. Task 3 complete!"


if __name__ == '__main__':
    app.debug = True
    app.run(host='0.0.0.0', port=5000)