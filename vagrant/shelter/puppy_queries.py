Star#This is how a file making use of the objects(rather than creating them in the database)
#would look like.

import datetime
from sqlalchemy import create_engine,desc
from sqlalchemy.orm import sessionmaker
from puppies import Base, Shelter, Puppy

engine = create_engine('sqlite:///puppyshelter.db', echo=True)
Base.metadata.bind = engine
DBSession = sessionmaker(bind=engine)
""":type: sqlalchemy.orm.Session"""
session = DBSession()


#1. Query all of the puppies and return the results in ascending alphabetical order
query1 = session.query(Puppy).order_by(Puppy.name)
pups1 = query1.all()
for item in pups1:
    print(item.name)
    print(item.dateOfBirth)

#2. Query all of the puppies that are less than 6 months old organized by the youngest first

#This query has a problem. Python knows how to deal with substraction of dates(it creates timedelta objects).
# however the database doesn't know, at least that's what this proves.
query2 = session.query(Puppy).\
    filter((datetime.date.today()-Puppy.dateOfBirth) < datetime.date.today()-(datetime.date.today()-datetime.timedelta(days=182))).\
    order_by(Puppy.dateOfBirth)
# This is what happens under the hood here.
# 2016-02-03 17:57:23,832 INFO sqlalchemy.engine.base.Engine SELECT puppy.id AS puppy_id, puppy.name AS puppy_name, puppy.gender AS puppy_gender, puppy."dateOfBirth" AS "puppy_dateOfBirth", puppy.picture AS puppy_picture, puppy.shelter_id AS puppy_shelter_id, puppy.weight AS puppy_weight
# FROM puppy
# WHERE ? - puppy."dateOfBirth" < ? ORDER BY puppy."dateOfBirth"
# 2016-02-03 17:57:23,832 INFO sqlalchemy.engine.base.Engine ('2016-02-03', '1970-07-02 00:00:00.000000')
pups2 = query2.all()

#Source: http://stackoverflow.com/questions/3424899/whats-the-simplest-way-to-subtract-a-month-from-a-date-in-python
def monthdelta(date, delta):
    #What month is it?
    m = (date.month+delta) % 12
    #What year is it?
    y = date.year + ((date.month)+delta-1) // 12
    #There is no month zero, month zero would be december.
    if not m:
        m = 12
    #Deals with day 31, when in fact, that month has only 30 days and situations like that.
    #this accounts for that.
    d = min(date.day, [31, 29 if y%4 == 0 and not y%400 == 0 else 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][m-1])
    #Let's get the shifted date.
    return date.replace(day=d, month=m, year=y)


query2 = session.query(Puppy).\
    filter(Puppy.dateOfBirth > monthdelta(datetime.date.today(), -6)).\
    order_by(desc(Puppy.dateOfBirth))
pups2 = query2.all()
for item in pups2:
    print("Name: "+item.name+" DOB: "+str(item.dateOfBirth))

#3. Query all puppies by ascending weight

#4. Query all puppies grouped by the shelter in which they are staying

