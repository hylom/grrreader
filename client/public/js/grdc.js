// grdc.js

(function () {

  function updateContentsPane(data) {
    var pane = $('#contentsPane');
    pane.empty();
    for (var i = 0; i < data.length; i++) {
      var item = data[i];
      var elem = '<tr><td>' + item.title + '</td>'
               + '<td><a target="_blank" href="' + item.url + '">'
               + '<i class="icon-chevron-right"></i></a></td></tr>';
      pane.append(elem);
    }
  }

  function loadFeed(event) {
    var feedId = $(event.target).attr('feed-id');
    if (feedId !== undefined) {
      var url = '/api/feed/' + feedId + '/contents';
      $.getJSON(url, updateContentsPane);
    }
    return false;
  }

  $(document).on('click', ".feedItem", loadFeed);
}).apply();


