// grdc.js
// require hogan.js template engine.

(function () {
  // private functions

  function updatePager(total, skip, count) {
    var totalPage = Math.floor((total - 1) / count + 1);
    var currentPage = Math.floor((skip - 1) / count + 1);
    var pane = $('#contentsPane');
    var feedId = Number(pane.attr('feedId'));
    var elem;
    var anchor;

    console.log(skip + ',' + count + '/' + total);
    console.log(currentPage + '/' + totalPage);

    var pagerRange = 2;
    var pagerStart = currentPage - pagerRange;
    if (pagerStart < 0) {
      pagerStart = 0;
    }
    var pagerEnd = pagerStart + 2 * pagerRange + 1;
    if (pagerEnd > totalPage) {
      pagerEnd = totalPage;
      pagerStart = pagerEnd - 5;
      if (pagerStart < 0) {
        pagerStart = 0;
      }
    }

    function _genHandler(feedId, skip, count) {
      return function(ev) {
        showFeed(feedId, skip, count);
      }
    }

    var paging = $('#page-navigation');
    paging.empty();

    if (pagerStart != 0) {
      paging.append($('<li class="disabled"><a href="#">...</a></li>'));
    }
    for (var i = pagerStart; i < pagerEnd; i++) {
      anchor = $('<a href="#">');
      anchor.text(i + 1);
      anchor.on('click', _genHandler(feedId, count * i, count));
      elem = $('<li>');
      elem.append(anchor);
      if (i == currentPage) {
        elem.addClass('disabled');
      }
      paging.append(elem);
    }
    if (pagerEnd != totalPage) {
      paging.append($('<li class="disabled"><a href="#">...</a></li>'));
    }
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
      + '  <i class="icon-chevron-right">&raquo;</i></a>'
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
    pane.attr('feedId', data.feedId);
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
    var paging = $('#page-navigation');
    paging.empty();
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
