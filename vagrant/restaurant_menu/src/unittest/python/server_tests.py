from mockito import mock, verify
import unittest
import server

class ServerTest(unittest.TestCase):
    def runTest(self):
        self.assertEqual('foo'.upper(), 'FOO')


if __name__ == '__main__':
    unittest.main()


