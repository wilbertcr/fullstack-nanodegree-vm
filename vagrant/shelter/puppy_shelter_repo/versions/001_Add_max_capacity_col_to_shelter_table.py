from sqlalchemy import Table, MetaData, Integer, Column
from migrate import *


def upgrade(migrate_engine):
    # Upgrade operations go here. Don't create your own engine; bind
    # migrate_engine to your metadata
    meta = MetaData(bind=migrate_engine)
    shelter = Table('shelter', meta, autoload=True)
    maximum_capacity = Column('maximum_capacity', Integer)
    maximum_capacity.create(shelter)
    pass


def downgrade(migrate_engine):
    # Operations to reverse the above upgrade go here.
    meta = MetaData(bind=migrate_engine)
    shelter = Table('shelter', meta, autoload=True)
    shelter.c.maximum_capacity.drop()
    pass