#!/bin/bash -x

echo "You will be asked to allow installation of dependencies. Simply press enter when this happens."
echo "Installing Node.js"
sudo apt-get install node
echo "Installing npm package manager"
sudo apt-get install npm
echo "Installing NodeJS dependencies and build tools for JS."
#Change directory to top level of React App.
cd src/frontend/
#Install all app dependencies.
#--no-bin-links tells npm not to create any symbolic links, as npm breaks in vagrant when they're used.
npm install --save-dev --no-bin-links
echo "Building React.js project"
#Enter tools folder and run gulp from there, that'll pick up the gulpfile.js in there and build the React.js app.
cd tools
nodejs ../node_modules/gulp/bin/gulp.js
#Change directory back to main folder
cd ../../../
echo "Setting up PSQL password and Database restaurant"
#Run script to setup DB.
cd src/backend/scripts/
./setup_db.sh
cd ../../../
echo "Setting up SQLAlchemy objects"
python src/backend/python/config/sql_alchemy_setup.py
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
echo "Executing PyBuilder"
pyb install_dependencies publish
python target/dist/*/server.py
