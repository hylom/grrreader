
/*
 * GET home page.
 */

mysql = require('mysql');
config = require('../config.json')

exports.index = function (req, res) {
  var connection = mysql.createConnection(config.mysql);

  connection.connect();
  connection.query('SELECT feed_id, url, title FROM feed_urls;', function (err, rows, fields) {
    connection.end();
    if (err) {
      res.send(500);
      return;
    }
    res.render('index', {
      title: 'Express',
      feeds: rows
    });
  });
};

exports.feedContent = function (req, res) {
  var contentId = req.params.cid;
  var connection = mysql.createConnection(config.mysql);

  connection.connect();
  var sql = 'SELECT content_id, feed_id, title, url, body, timestamp'
          + '  FROM feed_contents'
          + '  WHERE content_id = ?;'
  connection.query(sql, contentId, function (err, rows, fields) {
    connection.end();
    if (err) {
      res.send(500);
      return;
    }
    if (rows.length == 0) {
      res.send(404);
      return;
    }
    res.json(rows[0]);
  });
};

exports.feedContents = function (req, res) {
  var feedId = req.params.fid;
  var connection = mysql.createConnection(config.mysql);

  connection.connect();
  var sql = 'SELECT content_id, feed_id, title, url, body, timestamp'
          + '  FROM feed_contents'
          + '  WHERE feed_id = ?;'
  connection.query(sql, feedId, function (err, rows, fields) {
    connection.end();
    if (err) {
      res.send(500);
      return;
    }
    if (rows.length == 0) {
      res.send(404);
      return;
    }
    res.json(rows);
  });
};
