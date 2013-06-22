'MySQL database accessor'

import sys
import mysql.connector

from base import BaseDatabase
from config import config

class MySQLDatabase(BaseDatabase):
    "MySQL database accessor class"
    def __init__(self):
        self.config = config.get("mysql", None)
        if self.config is None:
            # no entry about MySQL connection in config.ini
            sys.stdout.write("No MySQL connection information in config file. abort.")
            sys.exit(-1)

    def _connect(self):
        return mysql.connector.connect(
            user = self.config["user"],
            password = self.config["password"],
            host = self.config["host"],
            port = self.config["port"],
            database = self.config["database"],
            charset = self.config["charset"]
        );

    def add_feed(self, url):
        "add RSS feed"
        conn = self._connect()
        cur = conn.cursor()
        sql = """
        SELECT * from feed_urls where url = %s;
        """
        cur.execute(sql, (url,))
        if cur.fetchone():
            # url is already registers
            return
        # insert feed
        sql = """
        INSERT INTO feed_urls (
          url
        ) VALUES (
          %s
        );
        """
        cur.execute(sql, (url,));
        cur.close()
        conn.close()

    def delete_tables(self):
        "delete all tables in MySQL database"
        conn = self._connect()
        cur = conn.cursor()
        sql = """
        DROP TABLE feed_urls;
        """
        cur.execute(sql)
        sql = """
        DROP TABLE feed_contents;
        """
        cur.execute(sql)
        

    def create_tables(self):
        "create tables in MySQL database"
        conn = self._connect()
        cur = conn.cursor()
        sql = """
        CREATE TABLE feed_urls (
          feed_id INT PRIMARY KEY AUTO_INCREMENT,
          url     TEXT NOT NULL
        )
        CHARACTER SET utf8;
        """
        cur.execute(sql)

        sql = """
        CREATE TABLE feed_contents (
          content_id INT PRIMARY KEY AUTO_INCREMENT,
          feed_id INT NOT NULL,
          title TEXT,
          url TEXT,
          body TEXT,
          datetime DATETIME NOT NULL
        )
        CHARACTER SET utf8;
        """
        cur.execute(sql)
        cur.close()
        conn.close()
