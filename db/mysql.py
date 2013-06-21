'MySQL database accessor'

import sys

from mysql import BaseDatabase
from config import config

class MySQLDatabase(BaseDatabase):
    "MySQL database accessor class"
    def __init__(self):
        self.config = config.get("mysql", None)
        if self.config is None:
            # no entry about MySQL connection in config.ini
            sys.stdout.write("No MySQL connection information in config file. abort.")
            sys.exit(-1)

    def create_tables(self):
        "create tables in MySQL database"
        """
        CREATE TABLE feed_urls (
          feed_id  INT PRIMAEY KEY AUTO_INCREMENT,
          url TEXT NOT NULL
        );
        CREATE TABLE feed_contents (
          content_id INT PRIMARY KEY AUTO_INCREMENT,
          feed_id INT NOT NULL,
          title TEXT,
          url TEXT,
          body TEXT,
          datetime DATETIME NOT NULL
        );
        """
