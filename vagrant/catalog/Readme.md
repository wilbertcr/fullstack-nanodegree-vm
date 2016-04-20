
## Catalog App

* A one page web application displaying categories and the items of the currently selected category. 
User can add,edit and delete categories and add,edit and delete their respective items.
* Backend is a flask application
* Front is React.js and JQuery for transmission of data.
* The backend of this application is strongly based on the restaurant menu app project in this nano-degree.
* The application implements an attempt at dealing with CSRF and OAuth 2.0 via google.

#Installation

Instructions are meant to be used by a user running the vagrant machine provided in the full-stack web developer nanodegree of Udacity.
If you don't have it, you have two options: 
 
 1) Install vagrant at https://www.vagrantup.com/downloads.html and then get the vagrant machine here https://github.com/udacity/fullstack-nanodegree-vm.
 
 2) Get a fresh linux VM and install the following:
 
```
$ sudo apt-get -qqy update
$ sudo apt-get -qqy install postgresql python-psycopg2
$ sudo apt-get -qqy install python-flask python-sqlalchemy
$ sudo apt-get -qqy install python-pip
$ pip install bleach
$ pip install oauth2client
$ pip install requests
$ pip install httplib2
$ pip install redis
$ pip install passlib
$ pip install itsdangerous
$ pip install flask-httpauth
$ su postgres -c 'createuser -dRS vagrant'
$ su vagrant -c 'createdb'
$ su vagrant -c 'createdb forum'
$ su vagrant -c 'psql forum -f /vagrant/forum/forum.sql'
$ wget http://download.redis.io/redis-stable.tar.gz
$ tar xvzf redis-stable.tar.gz
$ cd redis-stable
$ make
$ make install
```

*If you already had a vagrant machine, and in order to make sure we start at the same point. Please run the following on it:

`$vagrant destroy && vagrant up && vagrant reload`

*Then setup your SSH and login to the box. Once you get:

```

...
Welcome to Ubuntu 14.04.3 LTS (GNU/Linux 3.13.0-76-generic i686)

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
To access your shared files: cd /vagrant
```

`$cd /vagrant/catalog`

`$./build_and_run.sh`

**Important:** That script will be a while, I recommend you go get a coffee or do something else for a while. It will build both the front end and back end, setting up and populating the database, creating documentation along the way.

When you see this:
```
...
+ ./server.py
 * Running on http://0.0.0.0:5000/
 * Restarting with reloader

```

At this point, the application is running. You can:

* Go to the web application:

 `http://localhost:5000`

* Access the atom feed:

`http://localhost:5000/items_feed`

* Get a json representation of all the categories and their respective items:
 `http://localhost:5000/categories/json`
 
* Get a json representation of a category by providing its id:
 `http://localhost:5000/category/<int:category_id>/json`

* Get a json representation of an item:

 `http://localhost:5000/item/<int:item_id>/json`

All of the above are accessible without logging in to the application.

To kill the app: CTRL-C

# Running the app after building.

Once the app has been built, you can restart it like this:

`$./run_app.sh`

# Documentation

Once the app has been built, you will be able to see the documentation for the frontend here:

```
├── catalog
    ├── src
        ├── frontend
            ├── docs
                ├── *index.html
```
*Created with esdoc

The backend's documentation(created using flask-autodoc), can be accessed by navigating to: 

*http://0.0.0.0:5000/documentation
