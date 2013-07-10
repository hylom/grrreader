// grdc.js
// require hogan.js template engine.

(function () {
  // private functions

  function updateContentsPane(data) {
    var pane = $('#contentsPane');
    pane.empty();
    var tmpl = '<tr class="contentHeader" id="chead{{content_id}}">'
      + '<td class="contentTitle"><h4>'
      + '  <a href="#" class="contentTitleString" cid="{{content_id}}">{{title}}</a>'
      + '</h4></td>'
      + '<td class="contentTimestamp">{{formatedTimestamp}}</td>'
      + '<td class="contentLink">'
      + '  <a target="_blank" href="{{url}}">'
      + '  <i class="icon-chevron-right"></i></a>'
      + '</td></tr>'
      + '<tr class="contentBody" id="cbody{{content_id}}">'
      + '  <td colspan="3">{{{body}}}</td>'
      + '</tr>'
    ;
    var tableRows = Hogan.compile(tmpl);

    for (var i = 0; i < data.length; i++) {
      var item = data[i];
      var elem = tableRows.render(item);
      pane.append(elem);
    }
  }

  function loadFeed(event) {
    var feedId = $(event.target).attr('feed-id');
    var feedTitle = $(event.target).text();
    if (feedId !== undefined) {
      var url = '/api/feed/' + feedId + '/contents';
      $.getJSON(url, updateContentsPane);
    }
    $('#feedTitle').text(feedTitle);
    var pane = $('#contentsPane');
    pane.empty();
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

  $(document).ready(function () {
    var feedId = 0;
    var url = '/api/feed/' + feedId + '/contents';
    $.getJSON(url, updateContentsPane);
  });
}).apply();


