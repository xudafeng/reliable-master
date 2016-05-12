'use strict';

(function() {
  $('body').addClass('fadeIn');
  $('li').delegate('a', 'click', function(e) {
    var target = e.currentTarget;
    var parent = $(target).parent();
    if (parent.hasClass('disabled')) {
      return false;
    }
  });
  $('#submit_logout').on('click', function() {
    $.ajax({
      url: '/api/logout?_csrf=' + $('#csrf_token').val(),
      async: false,
      method: 'get',
      success: function(d) {
        if (d.success) {
          location.href = '/';
        } else {
          $('#dialog-content').html(d.errorMsg);
          $('#dialog').modal('show');
        }
      }
    });
    return false;
  });
  $('.page').on('click', function() {
    var page = $(this).data('page');
    if (page) {
      var href = location.href;
      if (!!~href.indexOf('/page')) {
        href = href.replace(/\/page\/\d+/, `/page/${page}`);
      } else {
        href += `/page/${page}`;
      }
      location.href = href;
    }
    return false;
  });
})();
