from sqlalchemy import Table, MetaData, String, Column
from migrate import *


def upgrade(migrate_engine):
    # Upgrade operations go here. Don't create your own engine; bind
    # migrate_engine to your metadata
    meta = MetaData(bind=migrate_engine)
    shelter = Table('shelter', meta, autoload=True)    
    pass


def downgrade(migrate_engine):
    # Operations to reverse the above upgrade go here.
    pass
