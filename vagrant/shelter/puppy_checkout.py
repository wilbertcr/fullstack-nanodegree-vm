#This is how a file making use of the objects(rather than creating them in the database)
#would look like.

import datetime
from sys import maxsize
from sqlalchemy import create_engine, func, Column, Integer, Table, MetaData, asc
from sqlalchemy.orm import sessionmaker
from migrate import changeset
from puppies import Base, Shelter, Puppy
5
engine = create_engine('sqlite:///puppyshelter.db', echo=True)
Base.metadata.bind = engine
DBSession = sessionmaker(bind=engine)
""":type: sqlalchemy.orm.Session"""
session = DBSession()

f = open('../../../puppies_key.txt', 'r')
api_key = f.readline()
url_base = 'https://maps.googleapis.com/maps/api/distancematrix/json?'


def get_shelter_occupancy():
    #Gets table of the form:
    # |shelter_id|puppies_in_shelter|
    shelter_occupancy = session.query(Shelter.id, func.count(Shelter.id).label('cnt')).\
        join(Puppy, Shelter.id == Puppy.shelter_id).\
        group_by(Shelter.name).\
        order_by(asc('cnt')).\
        all()
    return shelter_occupancy


def refresh_occupancy(shelter_occupancy):
    #We use the above to refresh the current
    #occupancy.
    for cur_count in shelter_occupancy:
        shelter = session.query(Shelter).\
            filter_by(id=cur_count[0]).one()
        shelter.cur_occupancy = cur_count[1]
        session.commit()

shelter_count = get_shelter_occupancy()

min_occupancy = maxsize
shelter_id = 0
print(shelter_count)


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
    refresh_occupancy(occupancy)
    return new_puppy