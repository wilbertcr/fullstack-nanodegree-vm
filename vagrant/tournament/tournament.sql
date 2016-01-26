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
DROP TABLE IF EXISTS tournaments CASCADE;
DROP TABLE IF EXISTS tournament_registration CASCADE;

CREATE TABLE players (
    id serial PRIMARY KEY,
    name TEXT
);

CREATE TABLE tournaments (
    tournament_id SERIAL PRIMARY KEY,
    name TEXT
);

CREATE TABLE tournament_registration(
    tournament_id INTEGER REFERENCES tournaments(tournament_id),
    player_id INTEGER REFERENCES players(id) ON DELETE CASCADE,
    -- A player can only be registered once for a given tournament at a given point in time.
    UNIQUE(tournament_id,player_id)
);

-- As safety, I am declaring the table such that
-- it won't allow matches among the same players
-- to be registered for the same tournament.
CREATE TABLE matches (
    match_id SERIAL PRIMARY KEY,
    tournament_id INTEGER REFERENCES tournaments(tournament_id) ON DELETE CASCADE,
    winner integer REFERENCES players(id) ON DELETE CASCADE,
    loser integer REFERENCES players(id) ON DELETE CASCADE,
    draw integer DEFAULT 0,
    -- The same two players cannot play more than once
    -- during the same tournament.
    UNIQUE(winner,loser,tournament_id),
    UNIQUE(loser,winner,tournament_id)
);

CREATE VIEW standings AS
    SELECT players.id as id,players.name as name,COALESCE(counts.wins_count,0) as wins,COALESCE(counts.matches_count,0) as matches
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
        ON players.id = counts.id
    ORDER BY wins DESC;


CREATE VIEW omw_table_raw AS
    SELECT *
    FROM
        (SELECT winner as player_id, loser as opponent, wins as opponent_wins
        FROM standings,matches
        WHERE
            -- Make sure we get the wins from the opponent(loser in this case).
            loser = standings.id AND
            -- Make sure the match wasn't a draw.
            draw = 0) AS opponents_count
        UNION
        (SELECT loser as player_id, winner as opponent, wins as opponent_wins
        FROM standings,matches
        WHERE
            -- Make sure we get the wins from the opponent(winner in this case)
            winner = standings.id AND
            -- Make sure the match wasn't a draw.
            draw = 0);


CREATE VIEW omw_table AS
    SELECT player_id, wins,  SUM(opponent_wins) AS opponents_wins
    FROM omw_table_raw,standings
    WHERE player_id = id
    GROUP BY player_id,wins
    ORDER BY opponents_wins DESC;


CREATE VIEW pairings AS
    SELECT id1,name1,id2,name2 FROM
    ( SELECT
        ROW_NUMBER() OVER () AS row_number,id as id1, name as name1
      FROM standings
    ) standings_1,
    ( SELECT
        ROW_NUMBER() OVER () AS row_number,id as id2,name as name2
      FROM standings
    ) standings_2
    WHERE standings_1.row_number % 2 = 1 AND standings_1.row_number+1=standings_2.row_number;
