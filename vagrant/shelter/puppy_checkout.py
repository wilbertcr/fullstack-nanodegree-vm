#This is how a file making use of the objects(rather than creating them in the database)
#would look like.

import json
import datetime
import urllib.request , urllib.parse
import time
from math import floor,ceil
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


def merge_sort(shelters):
    """ Implementation of mergesort """
    if(len(shelters) > 1):

        mid = len(shelters) / 2        # Determine the midpoint and split
        mid = ceil(mid)
        left = shelters[0:mid]
        right = shelters[mid:]

        merge_sort(left)            # Sort left list in-place
        merge_sort(right)           # Sort right list in-place

        l, r = 0, 0
        for i in range(len(shelters)):     # Merging the left and right list
            lval = left[l] if l < len(left) else None
            rval = right[r] if r < len(right) else None
            if (lval and rval and lval['driving_distance']['duration']['value'] < rval['driving_distance']['duration']['value']) \
                    or rval is None:
                shelters[i] = lval
                l += 1
            elif (lval and rval and lval['driving_distance']['duration']['value'] >= rval['driving_distance']['duration']['value']) \
                    or lval is None:
                shelters[i] = rval
                r += 1
            else:
                raise Exception('Could not merge, sub arrays sizes do not match the main array')


def get_distances(origin_address):
    api_key = get_key()
    url_base = 'https://maps.googleapis.com/maps/api/distancematrix/json?'
    shelter_occupancy = get_shelter_occupancy()
    shelters = []
    destinations_list = []
    for row in shelter_occupancy:
        shelter = row[0]
        shelters.append(shelter)
        address = shelter.address+', '+shelter.city+', '+shelter.state+' '+shelter.zipCode
        destinations_list.append(address)
    destinations = "|".join(destinations_list)
    query_args = {'origins': origin_address,
                  'destinations': destinations,
                  'key': api_key}
    encoded_args = urllib.parse.urlencode(query_args)
    url = url_base+encoded_args
    response = urllib.request.urlopen(url)
    parsed_json = json.loads(response.read().decode('utf-8'))
    rows = parsed_json['rows']
    driving_distances = rows[0]['elements']
    i = 0
    container = []
    for driving_distance in driving_distances:
        container.append({'shelter_object': shelters[i],
                          'address': destinations_list[i],
                          'driving_distance': driving_distance})
        shelter = shelters[i]
        print(shelter.id)
        address = destinations_list[i]
        print(destinations_list[i])
        value = driving_distance['duration']['value']
        print(value)
        i += 1

    merge_sort(container)
    for shelter in container:
        print(shelter['address'])
        print(shelter['driving_distance'])



origin_address = '655 12th Street, Oakland, CA 94607, USA'
get_distances(origin_address)

