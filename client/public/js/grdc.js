// grdc.js
// require hogan.js template engine.

(function () {
  // private functions

  function updatePager(total, skip, count) {
    var totalPage = Math.floor((total - 1) / count + 1);
    var currentPage = (skip == 0) ? 0 : (skip - 1) / count + 1;
    var elem = '';

    console.log(skip + ',' + count + '/' + total);
    console.log(currentPage + '/' + totalPage);

    var paging = $('#page-navigation');
    paging.empty();

    var pagingFirst = '<li id="paging-first"><a href="#">«</a></li>';
    paging.append(pagingFirst);

    if (currentPage > 0) {
      elem = '<li><a href="#">'
        + currentPage + '</a></li>';
      paging.append(elem);
    }

    elem = '<li class="active"><a href="#">' + (currentPage + 1)
      + '</a></li>';
    paging.append(elem);

    if (currentPage != totalPage) {
      elem = '<li><a href="#">'
        + (currentPage + 2) + '</a></li>';
      paging.append(elem);
    }

    var pagingLast = $('<li id="paging-last"><a href="#">»</a></li>');
    paging.append(pagingLast);
  }

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

    var contents = data.contents;
    for (var i = 0; i < contents.length; i++) {
      var item = contents[i];
      var elem = tableRows.render(item);
      pane.append(elem);
    }
    pane.attr('skip', data.skip);
    pane.attr('count', data.count);
    updatePager(data.total, data.skip, data.count);
  }

  function showFeed(feedId, skip, count) {
    skip = skip || 0;
    count = count || 20;
    feedId = Number(feedId);
    if (isNaN(feedId)) {
      return
    }
    var url = '/api/feed/' + feedId + '/contents'
      + '?skip=' + skip + '&count=' + count;
    $.getJSON(url, updateContentsPane);
  }

  // Load feed
  $(document).on('click', ".feedItem", function (ev) {
    var feedId = $(event.target).attr('feed-id');
    var feedTitle = $(event.target).text();
    if (feedId !== undefined) {
      showFeed(feedId);
    }
    $('#feedTitle').text(feedTitle);
    var pane = $('#contentsPane');
    pane.empty();
    return false;
  });

  // Toggle feed contents
  $(document).on('click', ".contentTitleString", function (ev) {
    var contentId = $(event.target).attr('cid');
    if (contentId !== undefined) {
      $('#cbody' + contentId).toggle();
    }
    return false;
  });

  // When page loaded, show 'All Feeds'
  $(document).ready(function () {
    showFeed(0);
  });

}).apply();
