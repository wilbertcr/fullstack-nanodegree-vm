from sqlalchemy import Table, Column, MetaData, Integer
from migrate import *


def upgrade(migrate_engine):
    # Upgrade operations go here. Don't create your own engine; bind
    # migrate_engine to your metadata
    meta = MetaData(bind=migrate_engine)
    shelter = Table('shelter', meta, autoload=True)
    cur_occupancy = Column('cur_occupancy',Integer)
    cur_occupancy.create(shelter)   
    pass


def downgrade(migrate_engine):
    # Operations to reverse the above upgrade go here.
    meta = MetaData(bind=migrate_engine)
    shelter = Table('shelter', meta, autoload=True)
    shelter.c.cur_occupancy.drop()    
    pass
