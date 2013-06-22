'Test for db.mysql'

from db import MySQLDatabase
import unittest

class TestMySQLDatabase(unittest.TestCase):
    "test case for MySQLDatabase"
    def setUp(self):
        self.mysql = MySQLDatabase()
        self.mysql.config["database"] = "testdb"
        self.mysql.create_tables()

    def test_add_feed(self):
        url = "http://example.com/"
        self.mysql.add_feed(url)

    def tearDown(self):
        self.mysql.delete_tables()

if __name__ == '__main__':
    unittest.main()

