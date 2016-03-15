from sqlalchemy import Column, ForeignKey, Integer, String, Date, Numeric, Table
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship
from sqlalchemy import create_engine
 
Base = declarative_base()

class Shelter(Base):
    __tablename__ = 'shelter'
    id = Column(Integer, primary_key=True)
    name = Column(String(80), nullable=False)
    address = Column(String(250))
    city = Column(String(80))
    state = Column(String(20))
    zipCode = Column(String(10))
    website = Column(String)
    maximum_capacity = Column(Integer)
    cur_occupancy = Column(Integer)

adoptions = Table('adoptions', Base.metadata,
                  Column('person_id', Integer, ForeignKey('person.id')),
                  Column('puppy_id', Integer, ForeignKey('puppy.id'))
                  )

#One-to-one association between the puppies
#and their profiles
#Many-to-many relation between 
#puppies and people
class Puppy(Base):
    __tablename__ = 'puppy'
    id = Column(Integer, primary_key=True)
    name = Column(String(250), nullable=False)
    gender = Column(String(6), nullable=False)
    dateOfBirth = Column(Date)
    picture = Column(String)
    shelter_id = Column(Integer, ForeignKey('shelter.id'))
    shelter = relationship(Shelter)
    weight = Column(Numeric(10))
    profiles = relationship("Profiles", uselist=False, back_populates="puppy")
    people = relationship("Person", secondary=adoptions)

#Many-to-many relation between 
#puppies and people
class Person(Base):
    __tablename__ = 'person'
    id = Column(Integer, primary_key=True)
    name = Column(String, nullable=False)
    puppies = relationship("Puppy", secondary=adoptions)

#One-to-one association between the puppies
#and their profiles
class Profiles(Base):
    __tablename__ = 'profiles'
    id = Column(Integer, primary_key=True)
    puppy_id = Column(Integer, ForeignKey('puppy.id'))
    picture = Column(String)
    description = Column(String(2000))
    special_needs = Column(String)
    puppy = relationship("Puppy", back_populates="profiles")


engine = create_engine('sqlite:///puppyshelter.db')
Base.metadata.create_all(engine)
