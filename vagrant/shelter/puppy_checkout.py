#This is how a file making use of the objects(rather than creating them in the database)
#would look like.

import json
import datetime
import urllib.parse, urllib.request
import time
from sys import maxsize
from sqlalchemy import create_engine, func, Column, Integer, Table, MetaData, asc
from sqlalchemy.orm import sessionmaker
from migrate import changeset
from puppies import Base, Shelter, Puppy

engine = create_engine('sqlite:///puppyshelter.db', echo=True)
Base.metadata.bind = engine
DBSession = sessionmaker(bind=engine)
""":type: sqlalchemy.orm.Session"""
session = DBSession()

def get_key():
    f = open('../../../puppies_key.txt', 'r')
    api_key = f.readline()
    return api_key


def get_shelter_occupancy():
    #Gets table of the form:
    # |shelter_id|puppies_in_shelter|
    shelter_occupancy = session.query(Shelter, func.count(Shelter.id).label('cnt')).\
        join(Puppy, Shelter.id == Puppy.shelter_id).\
        group_by(Shelter.name).\
        order_by(asc('cnt')).\
        all()
    return shelter_occupancy


def update_occupancy(shelter_occupancy):
    #We use the above to refresh the current
    #occupancy.
    for cur_count in shelter_occupancy:
        shelter = session.query(Shelter).\
            filter_by(id=cur_count[0].id).one()
        shelter.cur_occupancy = cur_count[1]
        session.commit()

shelter_occupancy = get_shelter_occupancy()
update_occupancy(shelter_occupancy)


def add_new_puppy(name, gender, dateOfBirth, picture, shelter_id, weight):
    """
    Args:
        name:
        gender:
        dateOfBirth:
        picture:
        shelter_id:
        weight:
    Returns:
        Puppy: A puppy object.
    """
    new_puppy = Puppy(name, gender, dateOfBirth, picture, shelter_id, weight)
    session.add(new_puppy)
    session.commit()
    occupancy = get_shelter_occupancy()
    update_occupancy(occupancy)
    return new_puppy

def get_distances(origin_address):
    api_key = get_key()
    url_base = 'https://maps.googleapis.com/maps/api/distancematrix/json?'
    shelter_occupancy = get_shelter_occupancy()
    destinations_list = []
    for row in shelter_occupancy:
        shelter = row[0]
        address = shelter.address+', '+shelter.city+', '+shelter.state+' '+shelter.zipCode
        destinations_list.append(address)
    destinations = "|".join(destinations_list)
    query_args = {'origins': origin_address,
                  'destinations': destinations,
                  'key': api_key}
    encoded_args = urllib.parse.urlencode(query_args)
    url = url_base+encoded_args
    response = urllib.request.urlopen(url)
    print(response.read().decode('utf-8'))


origin_address = '655 12th Street, Oakland, CA 94607, USA'
get_distances(origin_address)

