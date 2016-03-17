#Restaurants

A one page basic web application displaying a navigation bar representing restaurants and the menu of the currently selected restaurant. 
User can add,edit and delete restaurants and add,edit and delete their respective menu items.

Backend in flask and front end using React.js

#Important: Instructions are meant to be used by a user running the vagrant machine provided in the full-stack web developer nanodegree of Udacity.

In order to make sure we start at the same point. Please run:

`$vagrant destroy`

`$vagrant up`

Then setup your SSH and login to the box. Once you get:

```Welcome to Ubuntu 14.04.3 LTS (GNU/Linux 3.13.0-76-generic i686)

 * Documentation:  https://help.ubuntu.com/

  System information as of Wed Mar 16 18:10:15 UTC 2016

  System load:  0.9               Processes:           78
  Usage of /:   3.2% of 39.34GB   Users logged in:     0
  Memory usage: 15%               IP address for eth0: 10.0.2.15
  Swap usage:   0%

  Graph this data and manage this system at:
    https://landscape.canonical.com/

  Get cloud support with Ubuntu Advantage Cloud Guest:
    http://www.ubuntu.com/business/services/cloud

0 packages can be updated.
0 updates are security updates.


The shared directory is located at /vagrant
To access your shared files: cd /vagrant```

#Installation

First you need to setup the database, in the vagrant machine:

`$cd /vagrant/restaurant_menu`

`$./build_and_run.sh`

The script will ask you to confirm installation of Node.js and NPM(Needed for react). After you do that, it should set everything up on its own. 
When the script ends, you should see this:

```
...
[WARN]  Module 'server' was not imported by the covered tests
[WARN]  Module '__init__' was not imported by the covered tests
Coverage.py warning: No data was collected.
[WARN]  Test coverage below 70% for server:  0%
[WARN]  Test coverage below 70% for config.sql_alchemy_setup:  0%
[WARN]  Overall coverage is below 70%:  0%
[INFO]  Overall coverage branch coverage is  0%
[INFO]  Overall coverage partial branch coverage is 100%
BUILD FAILED - Test coverage for at least one module is below 70%
Build finished at 2016-03-16 21:22:06
Build took 4 seconds (4652 ms)
+ sleep 3s
+ python target/dist/restaurant_menu-1.0.dev0/server.py
 * Running on http://0.0.0.0:5000/
 * Restarting with reloader
 ````

Then you can just go to `http://localhost:5000/restaurants` on your browser, add a restaurant, click it and then  you'll
be able to save items to its menu. 


##Directory tree pre-build

```
.
├── build.py
├── build_and_run.sh
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
            └── __init__.py
```