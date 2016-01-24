-- Table definitions for the tournament project.
--
-- Put your SQL 'create table' statements in this file; also 'create view'
-- statements if you choose to use it.
--
-- You can write comments in this file by starting them with two dashes, like
-- these lines here.
\connect tournament;

DROP TABLE IF EXISTS players CASCADE;
DROP TABLE IF EXISTS matches CASCADE;

CREATE TABLE players (
    id serial PRIMARY KEY,
    name text
);

CREATE TABLE matches (
    match_id serial PRIMARY KEY,
    winner integer REFERENCES players(id),
    loser integer REFERENCES players(id)
);


CREATE VIEW standings AS
    SELECT players.id,players.name,COALESCE(counts.matches_count,0) as matches_count,COALESCE(counts.wins_count,0) as wins_count
    FROM
        players
        LEFT OUTER JOIN
        ((SELECT id,COALESCE(count(*),0) as matches_count
          FROM players, matches
          WHERE winner = id OR loser = id
          GROUP BY id) AS total_matches
         LEFT OUTER JOIN
         (SELECT id AS uid,COALESCE(count(*),0) as wins_count
         FROM players, matches
         WHERE winner = id
         GROUP BY id) AS total_wins
         ON total_matches.id = total_wins.uid) AS counts
        ON players.id = counts.id;

INSERT INTO players(name) VALUES('WILBERT');
INSERT INTO players(name) VALUES('RAFAEL');
INSERT INTO players(name) VALUES('MICHAEL');