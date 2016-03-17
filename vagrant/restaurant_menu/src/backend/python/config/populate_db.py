from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

from sql_alchemy_setup import Restaurant, Base, MenuItem

engine = create_engine('postgresql://vagrant:vagrantvm@localhost:5432/restaurant')
# Bind the engine to the metadata of the Base class so that the
# declaratives can be accessed through a DBSession instance
Base.metadata.bind = engine

DBSession = sessionmaker(bind=engine)
# A DBSession() instance establishes all conversations with the database
# and represents a "staging zone" for all the objects loaded into the
# database session object. Any change made against the objects in the
# session won't be persisted into the database until you call
# session.commit(). If you're not happy about the changes, you can
# revert all of them back to the last commit by calling
# session.rollback()
session = DBSession()



#Menu for UrbanBurger
restaurant1 = Restaurant(name="Urban Burger")

session.add(restaurant1)
session.commit()

restaurant1 = session.query(Restaurant).filter_by(name="Urban Burger").first()

menuItem1 = MenuItem(name="French Fries", description="with garlic and parmesan", price="$2.99", course="Appetizer", restaurant_id=restaurant1.id)

session.add(menuItem1)
session.commit()
