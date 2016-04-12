#!/bin/bash -x

echo "You will be asked to allow installation of dependencies. Simply press enter when this happens."
echo "Installing Node.js"
sudo apt-get install node
echo "Installing npm package manager"
sudo apt-get install npm
echo "Install python development library(needed by gevent)"
sudo apt-get install python-dev
echo "Installing NodeJS dependencies and build tools for JS."
#Change directory to top level of React App.
cd src/frontend/
ls -l
#Install all app dependencies.
#--no-bin-links tells npm not to create any symbolic links, as npm breaks in vagrant when they're used.
npm install --save-dev --no-bin-links
echo "Installing gulp globally so that command becomes available."
sudo -H npm install -g gulp
echo "Building React.js project"
#Enter tools folder and run gulp from there, that'll pick up the gulpfile.js in there and build the React.js app.
cd tools
ls -l
gulp default
#Change directory back to main folder
cd ../../
ls -l
cd backend/python/static/
ls -l
installnodejslegacy="sudo apt-get install nodejs-legacy"
eval $installnodejslegacy
npm install --save semantic-ui --no-bin-links
# Newer gulp-autoprefixer breaks building of css.
# We need to delete the newer one.
rm -rf node_modules/gulp-autoprefixer
# And install the older version that does work.
npm install gulp-autoprefixer@2.3.1 --no-bin-links
cd semantic
gulp build
cd ../../../
ls -l
echo "Setting up PSQL password and Database restaurant"
# Run script to setup DB.
cd scripts/
ls -l
./setup_db.sh
cd ../../../
ls -l
echo "Setting up SQLAlchemy objects"
python src/backend/python/config/sql_alchemy_setup.py
echo "Popularing database."
python src/backend/python/config/populate_db.py
echo "Installing virtual envirionment"
sudo -H pip install virtualenv
echo "Creating a virtual envirionment for the project's dependencies."
virtualenv venv --always-copy; source venv/bin/activate
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
echo "Installing flask-httpauth"
pip install flask-httpauth
pip install pybuilder
pyb install_dependencies
echo "Executing PyBuilder"
pyb
cd target/dist/*/
ls -l
python ./server.py