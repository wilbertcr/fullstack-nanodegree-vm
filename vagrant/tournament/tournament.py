#!/usr/bin/env python
# 
# tournament.py -- implementation of a Swiss-system tournament
#

import psycopg2
import bleach


def connect():
    """Connect to the PostgreSQL database.  Returns a database connection."""
    return psycopg2.connect("dbname=tournament")


def deleteMatches():
    """Remove all the match records from the database."""
    # Connect to database
    db_connection = connect()
    # Get db cursor
    db_cursor = db_connection.cursor()
    # Execute query
    db_cursor.execute("DELETE FROM matches")
    db_connection.commit()
    # Close cursor and connection to db.
    db_cursor.close()
    db_connection.close()


def deletePlayers():
    """Remove all the player records from the database."""
    # Connect to database
    db_connection = connect()
    # Get db cursor
    db_cursor = db_connection.cursor()
    # Execute query
    db_cursor.execute("DELETE FROM players")
    db_connection.commit()
    # Close cursor and connection to db.
    db_cursor.close()
    db_connection.close()


def countPlayers():
    """Returns the number of players currently registered."""
    # Connect to database
    db_connection = connect()
    # Get db cursor
    db_cursor = db_connection.cursor()
    # Execute query
    db_cursor.execute("SELECT count(*) FROM players")
    # Close cursor and connection to db.
    result = db_cursor.fetchone()
    db_cursor.close()
    db_connection.close()
    return result[0]


def registerPlayer(name):
    """Adds a player to the tournament database.
  
    The database assigns a unique serial id number for the player.  (This
    should be handled by your SQL database schema, not in your Python code.)
  
    Args:
      name: the player's full name (need not be unique).
    """
    # Connect to database
    db_connection = connect()
    # Get db cursor
    db_cursor = db_connection.cursor()
    # Execute query
    db_cursor.execute("INSERT INTO players(name) VALUES(%s) RETURNING id", (name,))
    player_id = db_cursor.fetchone()[0]
    db_connection.commit()
    db_cursor.close()
    db_connection.close()
    return player_id


def deleteTournaments():
    """Remove all the tournament records from the database."""
    # Connect to database
    db_connection = connect()
    # Get db cursor
    db_cursor = db_connection.cursor()
    # Execute query
    db_cursor.execute("DELETE FROM tournaments")
    db_connection.commit()
    db_cursor.close()
    db_connection.close()


def registerTournament(name):
    """Adds a tournament to the database.

    The database assigns a unique serial id number for the tournament,
    which is returned by this function.
    Args:
      :type name: str
      name: the tournament's name (need not be unique).
    Returns:
      :type tournament_id: int
      tournament_id: The tournament's id(unique)
    """
    # Connect to database
    db_connection = connect()
    # Get db cursor
    db_cursor = db_connection.cursor()
    # Execute query
    db_cursor.execute("INSERT INTO tournaments(name) VALUES(%s) RETURNING tournament_id", (name,))
    db_connection.commit()
    tournament_id = db_cursor.fetchone()[0]
    db_cursor.close()
    db_connection.close()
    return tournament_id


def registerPlayerInTournament(tournament_id, player_id):
    # Connect to database
    """Registers player into a particular tournament.

    Args:
        tournament_id:
        player_id:
    """
    db_connection = connect()
    # Get db cursor
    db_cursor = db_connection.cursor()
    # Execute query
    db_cursor.execute("INSERT INTO tournament_registration(tournament_id,player_id) VALUES(%s,%s);",
                      (tournament_id, player_id))
    db_connection.commit()
    db_cursor.close()
    db_connection.close()

def playerStandings(tournament_id):
    """Returns a list of the players and their win records, sorted by wins.

    The first entry in the list should be the player in first place, or a player
    tied for first place if there is currently a tie.

    Returns:
      A list of tuples, each of which contains (id, name, wins, matches):
        id: the player's unique id (assigned by the database)
        name: the player's full name (as registered)
        wins: the number of matches the player has won
        matches: the number of matches the player has played
    """
    # Connect to database
    db_connection = connect()
    # Get db cursor
    db_cursor = db_connection.cursor()
    # Execute query
    db_cursor.execute("SELECT id,name,wins,matches FROM standings WHERE tournament_id = %s;", (tournament_id,))
    # Get results
    results = db_cursor.fetchall()
    # Close cursor and connection
    db_cursor.close()
    db_connection.close()
    # Return results.
    return results


def reportMatch(tournament, winner, loser, draw=0):
    """Records the outcome of a single match between two players.

    Args:
      tournament: the id of the tournament this match belongs to.
      winner:  the id number of the player who won
      loser:  the id number of the player who lost
      draw: whether the game is a draw(1) or not(0)
    """
    # Connect to database
    db_connection = connect()
    # Get db cursor
    db_cursor = db_connection.cursor()
    # Execute query
    db_cursor.execute("INSERT INTO matches(tournament_id, winner, loser,draw) VALUES(%s,%s,%s,%s)",
                      (tournament, winner, loser, draw))
    # Commit Query
    db_connection.commit()
    # Close cursor and connection
    db_cursor.close()
    db_connection.close()


def swissPairings(tournament_id):
    """Returns a list of pairs of players for the next round of a match.
  
    Assuming that there are an even number of players registered, each player
    appears exactly once in the pairings.  Each player is paired with another
    player with an equal or nearly-equal win record, that is, a player adjacent
    to him or her in the standings.
  
    Returns:
      A list of tuples, each of which contains (id1, name1, id2, name2)
        id1: the first player's unique id
        name1: the first player's name
        id2: the second player's unique id
        name2: the second player's name
    """
    # Connect to database
    db_connection = connect()
    # Get db cursor
    db_cursor = db_connection.cursor()
    # Let's find out how many players are registered.
    db_cursor.execute("SELECT count(*) FROM tournament_registration WHERE tournament_id=%s", (tournament_id,))
    # And store it in variable "count"
    count = db_cursor.fetchone()[0]
    # If the number of players is even. Then we can get the pairings from the pairings table.
    db_result = 0
    if count % 2 == 0:
        db_cursor.execute("SELECT id1,name1, id2,name2 FROM pairings WHERE tournament_id1=%s", (tournament_id,))
        db_result = db_cursor.fetchall()
    # If the number of players is not even, then things are more complicated.
    else:
        # Let's first get all the players in the tournament.
        db_cursor.execute("SELECT * FROM omw_table WHERE tournament_id=%s;", (tournament_id,))
        # omw_table = SELECT player_id, name, wins,  SUM(opponent_wins) AS opponents_wins
        omw_table = db_cursor.fetchall()
        curr_index = count
        row = dict(omw_table[count])
        print(row)
    #        while True:
    #           db_cursor.execute("SELECT COUNT(*) FROM matches WHERE tournament_id=%s AND ", (tournament_id,))
    # Close cursor and connection
    db_cursor.close()
    db_connection.close()
    # Return results.
    return db_result
