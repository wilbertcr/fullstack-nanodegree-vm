import sys
from sqlalchemy import \
    Column, ForeignKey, Integer, String, create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship, backref

Base = declarative_base()

class MenuItem(Base):
    __tablename__ = 'menu_item'
    name = Column(String(80), nullable=False)
    id = Column(Integer, primary_key=True)
    course = Column(String(250))
    description = Column(String(250))
    price = Column(String(8))
    restaurant_id = Column(Integer, ForeignKey('restaurant.id'))
    @property
    def serialize(self):
        #Returns object data in serializeable format
        return {
            'name': self.name,
            'description': self.description,
            'id': self.id,
            'price': self.price,
            'course': self.course,
        }

class Restaurant(Base):
    __tablename__ = 'restaurant'
    name = Column(String(80), nullable=False)
    id = Column(Integer, primary_key=True)
    menu = relationship(MenuItem, cascade="all,delete")
    @property
    def serialize(self):
        #Returns object data in serializeable format
        return {
            'name': self.name,
            'id': self.id,
        }


engine = create_engine('postgresql://vagrant:vagrantvm@localhost:5432/restaurant')
Base.metadata.create_all(engine)
