
import json, sys
import datetime
import urllib.request , urllib.parse
import time
from math import floor,ceil
from sys import maxsize
from sqlalchemy import create_engine, func, Column, Integer, Table, MetaData, asc
from sqlalchemy.orm import sessionmaker
from migrate import changeset
from puppies import Base, Shelter, Puppy, Person

engine = create_engine('sqlite:///puppyshelter.db', echo=False)
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
    MAX_DOGS = 45
    for cur_count in shelter_occupancy:
        shelter = session.query(Shelter).\
            filter_by(id=cur_count[0].id).one()
        shelter.cur_occupancy = cur_count[1]
        shelter.maximum_capacity = MAX_DOGS
        session.commit()


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


def get_closest_shelter(origin_address):
    """
    Args:
        origin_address: The address of the user, looking to check a puppy into a shelter.
    Returns:
        shelter: A shelter(id,name,address,...) object
    Raises: Exception when no shelter has available space for this puppy.
    """
    api_key = get_key()
    url_base = 'https://maps.googleapis.com/maps/api/distancematrix/json?'
    shelter_occupancy = get_shelter_occupancy()
    shelters = []
    destinations_list = []
    #Here we populate a list(destinations_list) containing the shelters' addresses
    #in the format that google distance matrix API wants them.
    for row in shelter_occupancy:
        shelter = row[0]
        shelters.append(shelter)
        address = shelter.address+', '+shelter.city+', '+shelter.state+' '+shelter.zipCode
        destinations_list.append(address)
    #Google distance matrix wants addresses to be separated by "|" characters.
    #Let's make google happy.
    destinations = "|".join(destinations_list)
    #Let's put togethere the query arguments.
    query_args = {'origins': origin_address,
                  'destinations': destinations,
                  'key': api_key}
    #This is very transparent.
    encoded_args = urllib.parse.urlencode(query_args)
    url = url_base+encoded_args
    #Now we send the query
    response = urllib.request.urlopen(url)
    #Then we read and parse the response.
    parsed_json = json.loads(response.read().decode('utf-8'))
    #Check this out for info on the json structure:
    #https://developers.google.com/maps/documentation/distance-matrix/

    rows = parsed_json['rows']
    driving_distances = rows[0]['elements']
    i = 0
    container = []
    #Now we're gonna put together shelter objects and their
    #driving distances so we can choose based on how
    #far they are.
    for driving_distance in driving_distances:
        container.append({'shelter_object': shelters[i],
                          'address': destinations_list[i],
                          'driving_distance': driving_distance})
        shelter = shelters[i]
        #print(shelter.id)
        address = destinations_list[i]
        #print(destinations_list[i])
        value = driving_distance['duration']['value']
        #print(value)
        i += 1

    #I modified this to sort this objects.
    merge_sort(container)
    #Now the "shelters" are ordered from the closest to
    #farther away.
    #I am returning the closest shelter that has
    #space available, but we could perfectly return
    #the complete list and have the user choose.
    #Many choices here, all depending on the use case.
    for shelter in container:
        print(shelter['shelter_object'].cur_occupancy)
        print(shelter['shelter_object'].maximum_capacity)
        if(shelter['shelter_object'].cur_occupancy < shelter['shelter_object'].maximum_capacity):
            print(shelter['address'])
            print(shelter['driving_distance'])
            return shelter
    raise Exception("Zero empty shelters found.")

def execute_adoption(puppy_id,people_ids):
    print('executing adoption')
    for person_id in people_ids:
        puppy = session.query(Puppy).filter_by(id=puppy_id).first()
        person = session.query(Person).filter_by(id=person_id).first()
        if puppy and person:
            puppy.people.append(person)
            session.add(puppy)
            session.commit()
            print(puppy.people)
            print(person.puppies)


shelter_occupancy = get_shelter_occupancy()
update_occupancy(shelter_occupancy)

origin_address = '655 12th Street, Oakland, CA 94607, USA'
get_closest_shelter(origin_address)
execute_adoption(2, [2, 3, 5, 7])
