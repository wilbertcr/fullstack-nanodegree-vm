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
    db_cursor.execute("""INSERT INTO players(name) VALUES(%(str)s);""", {'str': name})
    db_connection.commit()
    db_cursor.close()
    db_connection.close()


def playerStandings():
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
    db_cursor.execute("SELECT * FROM standings;")
    # Get results
    results = db_cursor.fetchall()
    # Close cursor and connection
    db_cursor.close()
    db_connection.close()
    # Return results.
    return results


def reportMatch(winner, loser):
    """Records the outcome of a single match between two players.

    Args:
      winner:  the id number of the player who won
      loser:  the id number of the player who lost
    """
    # Connect to database
    db_connection = connect()
    # Get db cursor
    db_cursor = db_connection.cursor()
    # Execute query
    db_cursor.execute("""INSERT INTO matches( winner, loser) VALUES(%s,%s);""", (winner, loser))
    # Commit Query
    db_connection.commit()
    # Close cursor and connection
    db_cursor.close()
    db_connection.close()


def swissPairings():
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
    # Execute query
    db_cursor.execute("SELECT * FROM pairings;")
    # Get results
    db_result = db_cursor.fetchall()
    # Close cursor and connection
    db_cursor.close()
    db_connection.close()
    # Return results.
    return db_result
