#!/bin/bash -x

# Lets make sure this script runs relative to this location
# regardless of where is called from.
cd $(dirname $0)

# Here we setup a password for vagrant and create our DB.
psql -f catalog_schema.sql

# Now we setup sqlalchemy's objects and its relations.
python ../python/config/sql_alchemy_setup.py

# Finally we populate the DB with some dummy data so we have something to show when we fire this thing up.
python ../python/config/populate_db.py