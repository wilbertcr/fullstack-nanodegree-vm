-- Creating DB the old fashioned way also.

DROP DATABASE IF EXISTS restaurant;
CREATE DATABASE restaurant;
\connect restaurant;

DROP TABLE IF restaurants EXISTS CASCADE;
DROP TABLE IF menu_items EXISTS CASCADE;

CREATE TABLE restaurants (
    name TEXT NOT NULL,
    id serial PRIMARY KEY
);

CREATE TABLE menu_items (
  name TEXT NOT NULL,
  id SERIAL PRIMARY KEY,
  description TEXT NOT NULL,
  price INTEGER NOT NULL,
  course TEXT NOT NULL,
  restaurant_id INTEGER references restaurants(id)
);