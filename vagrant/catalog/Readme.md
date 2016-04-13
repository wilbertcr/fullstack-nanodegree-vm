
#Catalog App

A one page basic web application displaying a navigation bar representing categories and the items of the currently selected category.
User can add,edit and delete categories and add,edit and delete their respective items.

Backend in flask and front end using React.js

#Important:

Instructions are meant to be used by a user running the vagrant machine provided in the full-stack web developer nanodegree of Udacity.  If you don't have vagrant, please get install it and come back here.

#Installation

*In order to make sure we start at the same point. Please run:

`$vagrant destroy`

`$vagrant up`

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

**Important:** That script will be a while, I recommend you go get a coffe or do something else for a while. It will build both the front end and back end, setting up and populating the database, creating documentation along the way.

When you see this:
```
...
+ ./server.py
 * Running on http://0.0.0.0:5000/
 * Restarting with reloader

 ````

Then you can just go to:

 `http://localhost:5000/restaurants`

To kill the app: CTRL-C

#Running the app

Once the app has been installed, you can restart it like this:

`$./run_app.sh`