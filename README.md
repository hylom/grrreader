Rrreader
========================================

Rrreader - gxxgle Reader like Rss READER
(a.k.a. Gxxgle Reader Clone)


What is "rrreader"?
-------------------

Rrreader is Web-based RSS reader application. Rrreader has Gxxgle Reader
like AJAX based UI, independent RSS feed fetcher, and minimal features
are implemented.

Rrreader uses Python to fetch RSS feed, and Node.js to build HTTP Server
and Web UI.


Requires
--------
 * Python 2.7.x
 * Node.js 0.10.x
 * Some python modules: feedparser, dateutil.parser, mysql.connector
 * Some node.js modules: defined in client/package.json



How to install
--------------

1. install Python (>2.7.x), Node.js (>0.10.x), MySQL
2. create MySQL database and user for use
3. run `npm install` in client directory
4. copy client/config.json.sample to client/config.json
5. edit client/config.json
6. copy backend/config.ini.sample to backend/config.ini
7. edit backend/config.ini
8. fix 'DEST' line to install directory for client in install.sh
9. execute backend/feedfetcher.py to initial feed fetching
10. add backend/feedfetcher.py to crontab
11. start rrreader service like: `# service rreader start`


Sample crontab
--------------
    # MM HH DD MM WE CMD
    */30   *  *  *  *  cd /usr/local/share/rrreadder; /usr/bin/python feedfetcher.py > /dev/null


