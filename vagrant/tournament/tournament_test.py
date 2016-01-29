#!/usr/bin/env python
#
# Test cases for tournament.py

from tournament import *
import csv
import random
import math

def testDeleteMatches():
    deleteMatches()
    print("1. Old matches can be deleted.")


def testDelete():
    deleteMatches()
    deletePlayers()
    print("2. Player records can be deleted.")


def testCount():
    deleteMatches()
    deletePlayers()
    c = countPlayers()
    if c == '0':
        raise TypeError(
            "countPlayers() should return numeric zero, not string '0'.")
    if c != 0:
        raise ValueError("After deleting, countPlayers should return zero.")
    print("3. After deleting, countPlayers() returns zero.")


def testRegister():
    deleteMatches()
    deletePlayers()
    registerPlayer("Chandra Nalaar")
    c = countPlayers()
    if c != 1:
        raise ValueError(
            "After one player registers, countPlayers() should be 1.")
    print("4. After registering a player, countPlayers() returns 1.")


def testRegisterCountDelete():
    deleteMatches()
    deletePlayers()
    registerPlayer("Markov Chaney")
    registerPlayer("Joe Malik")
    registerPlayer("Mao Tsu-hsi")
    registerPlayer("Atlanta Hope")
    c = countPlayers()
    if c != 4:
        raise ValueError(
            "After registering four players, countPlayers should be 4.")
    deletePlayers()
    c = countPlayers()
    if c != 0:
        raise ValueError("After deleting, countPlayers should return zero.")
    print("5. Players can be registered and deleted.")


def testStandingsBeforeMatches():
    deleteMatches()
    deletePlayers()
    deleteTournaments()
    tournament_name = "Sunday Tournament"
    tournament_id = registerTournament(tournament_name)
    player_id = registerPlayer("Melpomene Murray")
    registerPlayerInTournament(tournament_id, player_id)
    player_id = registerPlayer("Randy Schwartz")
    registerPlayerInTournament(tournament_id, player_id)
    standings = playerStandings(tournament_id)
    if len(standings) < 2:
        raise ValueError("Players should appear in playerStandings even before "
                         "they have played any matches.")
    elif len(standings) > 2:
        raise ValueError("Only registered players should appear in standings.")
    if len(standings[0]) != 4:
        raise ValueError("Each playerStandings row should have four columns.")
    [(id1, name1, wins1, matches1), (id2, name2, wins2, matches2)] = standings
    if matches1 != 0 or matches2 != 0 or wins1 != 0 or wins2 != 0:
        raise ValueError(
            "Newly registered players should have no matches or wins.")
    if set([name1, name2]) != set(["Melpomene Murray", "Randy Schwartz"]):
        raise ValueError("Registered players' names should appear in standings,"
                         "even if they have no matches played.")
    print("6. Newly registered players appear in the standings with no matches.")


def testReportMatches():
    deleteMatches()
    deletePlayers()
    deleteTournaments()
    tournament_name = "Sunday Tournament"
    tournament_id = registerTournament(tournament_name)
    player_id = registerPlayer("Bruno Walton")
    registerPlayerInTournament(tournament_id, player_id)
    player_id = registerPlayer("Boots O'Neal")
    registerPlayerInTournament(tournament_id, player_id)
    player_id = registerPlayer("Cathy Burton")
    registerPlayerInTournament(tournament_id, player_id)
    player_id = registerPlayer("Diane Grant")
    registerPlayerInTournament(tournament_id, player_id)
    standings = playerStandings(tournament_id)
    [id1, id2, id3, id4] = [row[0] for row in standings]
    reportMatch(tournament_id, id1, id2)
    reportMatch(tournament_id, id3, id4)
    standings = playerStandings(tournament_id)
    for (i, n, w, m) in standings:
        if m != 1:
            raise ValueError("Each player should have one match recorded.")
        if i in (id1, id3) and w != 1:
            raise ValueError("Each match winner should have one win recorded.")
        elif i in (id2, id4) and w != 0:
            raise ValueError("Each match loser should have zero wins recorded.")
    print("7. After a match, players have updated standings.")


def testPairingsEven():
    deleteMatches()
    deletePlayers()
    deleteTournaments()
    tournament_name = "Sunday Tournament"
    tournament_id = registerTournament(tournament_name)
    player_id = registerPlayer("Twilight Sparkle")
    registerPlayerInTournament(tournament_id, player_id)
    player_id = registerPlayer("Fluttershy")
    registerPlayerInTournament(tournament_id, player_id)
    player_id = registerPlayer("Applejack")
    registerPlayerInTournament(tournament_id, player_id)
    player_id = registerPlayer("Pinkie Pie")
    registerPlayerInTournament(tournament_id, player_id)
    player_id = registerPlayer("Rarity")
    registerPlayerInTournament(tournament_id, player_id)
    player_id = registerPlayer("Rainbow Dash")
    registerPlayerInTournament(tournament_id, player_id)
    player_id = registerPlayer("Princess Celestia")
    registerPlayerInTournament(tournament_id, player_id)
    player_id = registerPlayer("Princess Luna")
    registerPlayerInTournament(tournament_id, player_id)
    standings = playerStandings(tournament_id)
    [id1, id2, id3, id4, id5, id6, id7, id8] = [row[0] for row in standings]
    pairings = swissPairings(tournament_id)
    if len(pairings) != 4:
        raise ValueError(
            "For eight players, swissPairings should return 4 pairs. Got {pairs}".format(pairs=len(pairings)))
    reportMatch(tournament_id, id1, id2)
    reportMatch(tournament_id, id3, id4)
    reportMatch(tournament_id, id5, id6)
    reportMatch(tournament_id, id7, id8)
    pairings = swissPairings(tournament_id)
    if len(pairings) != 4:
        raise ValueError(
            "For eight players, swissPairings should return 4 pairs. Got {pairs}".format(pairs=len(pairings)))
    [(pid1, pname1, pid2, pname2), (pid3, pname3, pid4, pname4), (pid5, pname5, pid6, pname6), (pid7, pname7, pid8, pname8)] = pairings
    possible_pairs = set([frozenset([id1, id3]), frozenset([id1, id5]),
                          frozenset([id1, id7]), frozenset([id3, id5]),
                          frozenset([id3, id7]), frozenset([id5, id7]),
                          frozenset([id2, id4]), frozenset([id2, id6]),
                          frozenset([id2, id8]), frozenset([id4, id6]),
                          frozenset([id4, id8]), frozenset([id6, id8])
                          ])
    actual_pairs = set([frozenset([pid1, pid2]), frozenset([pid3, pid4]), frozenset([pid5, pid6]), frozenset([pid7, pid8])])
    for pair in actual_pairs:
        if pair not in possible_pairs:
            raise ValueError(
                "After one match, players with one win should be paired.")
    print('8. After one match, players with one win are properly paired.')


def testPairingsOdd():
    deleteMatches()
    deletePlayers()
    deleteTournaments()
    tournament_name = "Sunday Tournament"
    tournament_id = registerTournament(tournament_name)
    player_id = registerPlayer("Twilight Sparkle")
    registerPlayerInTournament(tournament_id, player_id)
    player_id = registerPlayer("Fluttershy")
    registerPlayerInTournament(tournament_id, player_id)
    player_id = registerPlayer("Applejack")
    registerPlayerInTournament(tournament_id, player_id)
    player_id = registerPlayer("Pinkie Pie")
    registerPlayerInTournament(tournament_id, player_id)
    player_id = registerPlayer("Rarity")
    registerPlayerInTournament(tournament_id, player_id)
    standings = playerStandings(tournament_id)

    [id1, id2, id3, id4, id5] = [row[0] for row in standings]
    pairings = swissPairings(tournament_id)
    if len(pairings) != 3:
        raise ValueError(
            "For 5 players, swissPairings should return 3 pairs. Got {pairs}".format(pairs=len(pairings)))

    f = open("pairings.csv", 'w')
    f.write("id1, name1, id2, name2,winner\n")
    c = int(math.ceil(log(countPlayers(), 2)))
    while c > 0:
        pairings = swissPairings(tournament_id)
        for row in pairings:
            [id1, name1, id2, name2] = row
            coin_toss = random.randint(0, 2)
            if coin_toss == 0:
                f.write("{0},{1},{2},{3},{4}\n".format(id1, name1, id2, name2, id1))
                reportMatch(tournament_id, id1, id2)
            elif coin_toss == 1:
                f.write("{0},{1},{2},{3},{4}\n".format(id1, name1, id2, name2, id2))
                reportMatch(tournament_id, id2, id1)
            else:
                f.write("{0},{1},{2},{3},{4}\n".format(id1, name1, id2, name2, id2, 1))
                reportMatch(tournament_id, id2, id1, 1)
        c -= 1
    print("9. Emulated tournament with 5 players.")

# You can get a list with a lost more players at
# http://chess-results.com/tnr138146.aspx?lan=1&zeilen=0&flag=30&wi=821&prt=4
# It's an excel sheet with the same format as the input I am giving it.
#
def testPairings():
    deleteMatches()
    deletePlayers()
    deleteTournaments()
    tournament_name = "Sunday Tournament"
    tournament_id = registerTournament(tournament_name)

    with open('players.csv','rb') as csvfile:
        file_reader = csv.DictReader(csvfile,delimiter=',')
        for row in file_reader:
            registerPlayerInTournament(tournament_id, registerPlayer(row['Name']))
    c = int(math.ceil(log(countPlayers(), 2)))
    while c > 0:
        f = open("pairings{0}.csv".format(c), 'w')
        f.write("id1, name1, id2, name2,winner\n")
        pairings = swissPairings(tournament_id)
        for row in pairings:
            [id1, name1, id2, name2] = row
            coin_toss = random.randint(0, 1)
            if coin_toss == 0:
                f.write("{0},{1},{2},{3},{4}\n".format(id1, name1, id2, name2, id1))
                reportMatch(tournament_id, id1, id2)
            else:
                f.write("{0},{1},{2},{3},{4}\n".format(id1, name1, id2, name2, id2))
                reportMatch(tournament_id, id2, id1)
        c -= 1
    print("10. Successfully Emulated tournament with {0} players "
          "loaded from file".format(countPlayersInTournament(tournament_id)))


if __name__ == '__main__':
    testDeleteMatches()
    testDelete()
    testCount()
    testRegister()
    testRegisterCountDelete()
    testStandingsBeforeMatches()
    testReportMatches()
    testPairingsEven()
    testPairingsOdd()
    testPairings()
    print("Success!  All tests pass!")


