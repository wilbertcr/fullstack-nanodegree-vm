#
# Database access functions for the web forum.
# 

import time
import psycopg2
import bleach

# Database connection
def connect():
    """Connect to the PostgreSQL database.  Returns a database connection."""
    return psycopg2.connect("dbname=forum")


# Get posts from database.


def GetAllPosts():
    """Get all the posts from the database, sorted with the newest first.
    Returns:
      A list of dictionaries, where each dictionary has a 'content' key
      pointing to the post content, and 'time' key pointing to the time
      it was posted.
    """
    # Connect to database
    db_connection = connect()
    # Get db cursor
    db_cursor = db_connection.cursor()
    # Execute query
    db_cursor.execute("SELECT * FROM posts ORDER BY time DESC")
    # Fetch results
    db_result = db_cursor.fetchall()
    # Process results(turn them into a dictionary)
    posts = [{'content': str(row[1]), 'time': str(row[0])} for row in db_result]
    # Close cursor and connection to db.
    db_cursor.close()
    db_connection.close()
    # Return posts
    return posts

# Add a post to the database.


def AddPost(content):
    """Add a new post to the database.

    Args:
      content: The text content of the new post.
    """
    # Clean user input from code.
    content = bleach.clean(content)
    # Connect to the database
    db_connection = connect()
    # Get db cursor
    db_cursor = db_connection.cursor()
    # Insert post into db
    db_cursor.execute("INSERT INTO posts (content) VALUES (%(str)s);", {'str': content})
    # Commit post insertion if all went well.
    db_connection.commit()
    # Close cursor and connection to db.
    db_cursor.close()
    db_connection.close()