#!/usr/bin/env python
# 
# tournament.py -- implementation of a Swiss-system tournament
#

import psycopg2
import bleach
from math import log


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
    # Let's find out how many players are registered in the tournament.
    db_cursor.execute("SELECT count(*) FROM tournament_registration WHERE tournament_id=%s", (tournament_id,))
    # And store it in variable "count"
    players_in_tournament = db_cursor.fetchone()[0]
    # If the number of players is even. Then we can get the pairings from the pairings table.
    db_cursor.execute("SELECT count(*) FROM matches WHERE tournament_id = %s", (tournament_id,))
    registered_matches = db_cursor.fetchone()[0]
    db_result = 0
    if players_in_tournament % 2 == 0:
        if registered_matches == 0 or registered_matches % (players_in_tournament/2)  == 0:
            db_cursor.execute("SELECT id1,name1, id2,name2 FROM pairings WHERE tournament_id1=%s", (tournament_id,))
            db_result = db_cursor.fetchall()
        else:
            print("Finish Entering the round! Data is inaccurate right now! I probably broke something!\n")
    # If the number of players is not even, then things are more complicated.
    else:
        if registered_matches == 0 or registered_matches % ((players_in_tournament+1)/2) == 0:
            # Let's first get all the players in the tournament ordered by wins and then by omw.
            db_cursor.execute("SELECT id, name, wins, opponents_wins "
                              "FROM omw_table WHERE tournament_id=%s"
                              "ORDER BY wins,opponents_wins;", (tournament_id,))
            # omw_table = SELECT
            omw_table = db_cursor.fetchall()
            # We're going to start at the bottom index.
            curr_index = players_in_tournament
            # We'll use fake_player and draw to create "matches" representing "byes"
            # Such matches will have the player that was granted the bye as a winner
            # and playerId -1 as a loser.
            fake_player = -1
            # Let's start iterating from the bottom.
            while curr_index > 0:
                # Getting current row.
                current_row = omw_table[curr_index - 1]
                # Getting row's playerId field.
                player_id = current_row[0]
                # Let's check if player has received a bye before.
                db_cursor.execute("SELECT COALESCE(count(*),0) FROM matches "
                                  "WHERE tournament_id=%s AND "
                                  "winner = %s AND "
                                  "loser = %s", (tournament_id, player_id, fake_player))
                bye_count = db_cursor.fetchone()[0]
                # If this player's bye count is zero for this tournament.
                if bye_count == 0:
                    # Then we will return it as playing against him/herself in this round.
                    db_cursor.execute("SELECT id as id1, name as name1, id as id2, name as name2 "
                                      "FROM omw_table "
                                      "WHERE id = %s "
                                      "UNION "
                                      "SELECT id1,name1,id2,name2 FROM "
                                          "(SELECT ROW_NUMBER() OVER () AS row_number,tournament_id as tournament_id1, id as id1, name as name1 "
                                          "FROM omw_table WHERE id != %s) omw_table1,"
                                          "(SELECT ROW_NUMBER() OVER () AS row_number,tournament_id as tournament_id2, id as id2,name as name2 "
                                          "FROM omw_table WHERE id != %s) omw_table2 "
                                      "WHERE mod(omw_table1.row_number, 2) = 1 AND omw_table1.row_number+1=omw_table2.row_number;",(player_id, player_id, player_id))
                    # Fetch results.
                    db_result = db_cursor.fetchall()
                    # And break out of the loop, since we found a player without a bye for this round.
                    break
                # Otherwise
                else:
                    # Let's just check next player up the t
                    curr_index -= 1
        else:
            print("Finish Entering the round! Data is inaccurate right now! I probably broke something!\n")
    # Even though this pairing grants the bye to the right players, it can spit out
    # pairings that will result in rematches.
    for row in db_result:
        [id1, name1, id2, name2] = row
        db_cursor.execute("SELECT count(*) "
                          "FROM matches "
                          "WHERE tournament_id = %s AND "
                          "((winner = %s AND loser = %s) OR (winner = %s AND loser = %s))",
                          (tournament_id, id1, id2, id2, id1))
        repeated_pairings = db_cursor.fetchone()[0]
        if repeated_pairings > 0:
            print("Pairing between player {0} and {1} is a rematch.\n".format(name1, name2))
    db_cursor.close()
    db_connection.close()
    # Return results.
    return db_result