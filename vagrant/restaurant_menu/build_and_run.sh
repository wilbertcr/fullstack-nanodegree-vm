#!/bin/bash -x

echo "You will be asked to allow installation of dependencies. Simply press enter when this happens."
echo "Installing Node.js"
sudo apt-get install node
echo "Installing npm package manager"
sudo apt-get install npm
echo "Installing JS dependencies."
cd src/frontend/
#--no-bin-links tells npm not to create any symbolic links, as npm breaks in vagrant when they're used.
npm install --save-dev --no-bin-links
sleep 3
echo "Building React.js project"
cd tools
nodejs ../node_modules/gulp/bin/gulp.js
cd ../../../
echo "Setting up PSQL password and Database restaurant"
ls
cd src/backend/scripts/
./setup_db.sh
sleep 1s
cd ../../../
echo "Setting up SQLAlchemy objects"
sleep 1s
python src/backend/python/config/sql_alchemy_setup.py
sleep 1s
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
sleep 3s
python target/dist/*/server.py
