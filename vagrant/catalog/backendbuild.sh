#!/bin/bash -x
echo "Installing virtual envirionment"
sudo -H pip install virtualenv
echo "Creating a virtual envirionment for the project's dependencies."
virtualenv venv --always-copy
source venv/bin/activate
# Run script to setup DB.
sudo apt-get --assume-yes install libpq-dev python-dev
sudo apt-get --assume-yes install python-psycopg2
sudo apt-get --assume-yes install python-flask python-sqlalchemy
echo "Installing flask"
sudo pip install flask
echo "Installing coverage"
sudo pip install coverage
echo "Installing PyBuilder"
sudo -H pip install pybuilder
echo "Installing mockito"
sudo pip install mockito
echo "Installing flake8"
sudo pip install flake8
echo "Installing xmlrunner"
sudo pip install xmlrunner
echo "Installing coverage"
sudo pip install coverage
echo "Installing bleach"
pip install bleach
echo "Installing oauth2client"
pip install oauth2client
echo "Installing requests"
pip install requests
echo "Installing httplib2"
pip install httplib2
echo "Installing redis"
pip install redis
echo "Installing passlib"
pip install passlib
echo "Installing itsdangerous"
pip install itsdangerous
echo "Installing psycopg2"
pip install psycopg2
echo "Installing flask-httpauth"
pip install flask-httpauth
echo "Installing flask-autodoc"
sudo -H pip install flask-autodoc
echo "Install PyBuilder"
pip install pybuilder
echo "Installing SQLAlchemy"
pip install SQLAlchemy
cd src/backend/scripts/
ls -l
./setup_db.sh
cd ../../../
ls -l
echo "Executing PyBuilder"
pyb install_dependencies
pyb analyze
pyb
echo "Moving environment to target directory"
virtualenv --relocatable venv
mv venv target/dist/
cd target/dist/
ls -l
./server.py
