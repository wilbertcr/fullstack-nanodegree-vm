#!/bin/bash -x

echo "Installing Node.js"
sudo apt-get --assume-yes install nodejs
echo "Installing npm package manager"
sudo apt-get --assume-yes install npm
echo "Installing NodeJS dependencies and build tools for JS."
# Change directory to top level of React App.
cd src/frontend/
ls -l
# Install all app dependencies.
# --no-bin-links tells npm not to
# create any symbolic links, as npm
# breaks in vagrant when they're used.
npm install --save-dev --no-bin-links
# This is needed for semantic, it doesn't
# like that nodejs is not named node
# installing it fixes that.
installnodejslegacy="sudo apt-get --assume-yes install nodejs-legacy"
eval $installnodejslegacy

echo "Installing gulp globally so that
command becomes available."
sudo -H npm install -g gulp
echo "Building React.js project"
#Enter tools folder and run gulp from there,
# that'll pick up the gulpfile.js in there and
# run its default task
cd tools
ls -l
node ../node_modules/gulp/bin/gulp
#Change directory back to main folder
cd ../../
ls -l
cd backend/python/static/
ls -l
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