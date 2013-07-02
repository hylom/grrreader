
/*
 * GET home page.
 */

mysql = require('mysql');
config = require('../config.json');
util = require('util');

function timestampToDate(ts) {
  var formatString = '%s/%s/%s';
  var year = ts.getFullYear();
  var month = ts.getMonth();
  var day = ts.getDate();

  year = String(year).slice(2, 4);
  month = (month < 10) ? '0' + month : String(month);
  day = (day < 10) ? '0' + day : String(day);

  return util.format(formatString, year, month, day);
}

function timestampToTime(ts) {
  var formatString = '%s:%s';
  var hours = ts.getHours();
  var minutes = ts.getMinutes();

  hours = (hours < 10) ? '0' + hours : String(hours);
  minutes = (minutes < 10) ? '0' + minutes : String(minutes);

  return util.format(formatString, hours, minutes);
}

function formatTimestamp(ts) {
  var today = timestampToDate(new Date());
  var day = timestampToDate(ts);
  if (day == today) {
    return timestampToTime(ts);
  } else {
    return day;
  }
}

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
    for (var i = 0; i < rows.length; i++) {
      rows[i].formatedTimestamp = formatTimestamp(rows[i].timestamp);
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
          + '  WHERE feed_id = ?'
          + '  ORDER BY timestamp DESC'
          + ';';
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
    for (var i = 0; i < rows.length; i++) {
      rows[i].formatedTimestamp = formatTimestamp(rows[i].timestamp);
    }
    res.json(rows);
  });
};
