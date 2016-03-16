#Restaurants

A one page basic web application displaying a navigation bar representing restaurants and the menu of the currently selected restaurant. 
User can add,edit and delete restaurants and add,edit and delete their respective menu items.


#Installation

First you need to setup the database:

`$ psql`

`$ALTER ROLE vagrant WITH ENCRYPTED PASSWORD 'vagrantvm';`

`$DROP DATABASE IF EXISTS restaurant;`

`$CREATE DATABASE restaurant;`

```
.
├── build.py
├── docs
├── index.md
├── __init__.py
├── README.md
├── setup.py
└── src
    ├── backend
    │   ├── __init__.py
    │   ├── python
    │   │   ├── config
    │   │   │   ├── database_setup.py
    │   │   │   ├── database_setup.pyc
    │   │   │   ├── __init__.py
    │   │   ├── __init__.py
    │   │   ├── server.py
    │   │   ├── static
    │   │   │   ├── images
    │   │   │   ├── javascript
    │   │   │   │   ├── Component.js
    │   │   │   │   ├── index.js
    │   │   │   │   ├── main.js
    │   │   │   │   ├── MenuItem.js
    │   │   │   │   ├── Menu.js
    │   │   │   │   ├── NewItemForm.js
    │   │   │   │   ├── NewRestaurantForm.js
    │   │   │   │   ├── Restaurant.js
    │   │   │   │   └── RestaurantList.js
    │   │   │   └── styles
    │   │   │       ├── main.css
    │   │   │       └── styles.css
    │   │   └── templates
    │   │       └── restaurants.html
    │   └── scripts
    │       └── restaurant_menu_schema.sql
    ├── frontend
    │   ├── components
    │   │   ├── Component.jsx
    │   │   ├── index.jsx
    │   │   ├── MenuItem.jsx
    │   │   ├── Menu.jsx
    │   │   ├── NewItemForm.jsx
    │   │   ├── NewRestaurantForm.jsx
    │   │   ├── Restaurant.jsx
    │   │   └── RestaurantList.jsx
    │   ├── node_modules
    │   ├── package.json
    │   └── tools
    │       ├── gulpfile.js
    │       └── webpack.config.js
    └── unittest
        └── python
            └── __init__.py```

Now you need to build the project. Go to the root of the restaurant_menu project. 

