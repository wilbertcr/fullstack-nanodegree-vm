import datetime
from sqlalchemy import \
    Column, ForeignKey, Integer, String, Boolean, DateTime, create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship


Base = declarative_base()


class User(Base):
    __tablename__ = 'user'
    id = Column(String, primary_key=True)
    name = Column(String, nullable=False)
    # e-mails cannot be larger than 250 characters by definition, so this shouldn't fail with
    # any legitimate e-mail.
    email = Column(String(250), nullable=False)
    picture = Column(String)
    is_admin = Column(Boolean, default=False, nullable=False)

    @property
    def serialize(self):
        # Returns object data in serializeable format
        return {
            'id': self.id,
            'name': self.name,
            'email': self.email,
            'picture': self.picture,
            'is_admin': self.is_admin
        }


class Category(Base):
    __tablename__ = 'category'

    id = Column(Integer, primary_key=True)
    name = Column(String, nullable=False)
    picture = Column(String)

    @property
    def serialize(self):
        # Returns object data in serializeable format
        return {
            'id': self.id,
            'name': self.name,
            'picture': self.picture,
            'items': [item.serialize for item in self.items]
        }


class Item(Base):
    __tablename__ = 'item'
    id = Column(Integer, primary_key=True)
    name = Column(String, nullable=False)
    description = Column(String, nullable=False)
    price = Column(String, nullable=False)
    picture = Column(String)
    created = Column('created', DateTime, default=datetime.datetime.now)
    last_updated = Column('last_updated', DateTime, default=datetime.datetime.now, onupdate=datetime.datetime.now)
    category_id = Column(Integer, ForeignKey('category.id', ondelete="CASCADE"))
    category = relationship(Category, back_populates="items")

    @property
    def serialize(self):
        # Returns object data in serializeable format
        return {
            'id': self.id,
            'name': self.name,
            'description': self.description,
            'price': self.price,
            'picture': self.picture,
            'category_id': self.category_id,
            'created': self.created,
            'last_updated': self.last_updated
        }

Category.items = relationship(Item, order_by=Item.id, back_populates="category")

engine = create_engine('postgresql://vagrant:vagrantvm@localhost:5432/catalog')
Base.metadata.create_all(engine)
