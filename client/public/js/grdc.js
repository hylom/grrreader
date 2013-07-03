// grdc.js

(function () {
  function updateContentsPane(data) {
    var pane = $('#contentsPane');
    pane.empty();
    for (var i = 0; i < data.length; i++) {
      var item = data[i];
      var elem = '<tr class="contentHeader" id="chead' + item.content_id + '">'
        + '<td class="contentTitle"><h4><a href="#" class="contentTitleString" cid="' + item.content_id + '">' + item.title + '</a></h4></td>'
        + '<td class="contentTimestamp">' + item.formatedTimestamp + '</td>'
        + '<td class="contentLink"><a target="_blank" href="' + item.url + '">'
        + '<i class="icon-chevron-right"></i></a></td>'
        + '</tr>'
        + '<tr class="contentBody" id="cbody' + item.content_id + '">'
        + '<td colspan="3">'
        + item.body
        + '</td>'
        + '</tr>'
      ;
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

  function toggleContentBody(event) {
    var contentId = $(event.target).attr('cid');
    console.log('click header ' + contentId);
    if (contentId !== undefined) {
      $('#cbody' + contentId).toggle();
    }
    return false;
  }

  $(document).on('click', ".feedItem", loadFeed);
  $(document).on('click', ".contentTitleString", toggleContentBody);
}).apply();


