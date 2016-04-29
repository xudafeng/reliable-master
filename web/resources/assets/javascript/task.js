

'use strict';

(function() {
  $('#retry').on('click', function() {
    var taskId = $(this).data('id');
    $.ajax({
      url: '/api/task/update?_csrf=' + $('#csrf_token').val(),
      async: false,
      method: 'post',
      data: {
        taskId: taskId,
        data: {
          status: 0
        }
      },
      success: function(d) {
        if (!d.success) {
          alert(d.errMsg);
        }
        location.reload();
      }
    });
    return false;
  });
  var bash = $('.bash');

  function download(filename, text) {
    var pom = document.createElement('a');
    pom.setAttribute('href', 'data:text/html;charset=utf-8,' + encodeURIComponent(text));
    pom.setAttribute('download', filename);

    if (document.createEvent) {
      var event = document.createEvent('MouseEvents');
      event.initEvent('click', true, true);
      pom.dispatchEvent(event);
    } else {
      pom.click();
    }
  }

  $('.log-export').on('click', function() {
    var text = bash.html();
    var taskTitle = $('.col-md-9 .alert h4')[0].firstChild.nodeValue;
    var taskDate = $('.col-md-9 .clearfix .pull-right')[0].firstChild.nodeValue;
    var result = $('.col-md-3 .build-widget:first-child h4')[0].firstChild.nodeValue;
    var filename = 'reliable-' + taskTitle + '-' + taskDate + '-' + result;
    download(filename, text);
  });

  $(function() {
    $('img').lazyload();
  });

  var modalImage = null;
  $('.bash img').click(function() {
    modalImage = $(this);
    $('#image-modal').modal();
  });

  function isUsingWidth(image) {
    var win = $(window);
    var img = $(image);

    if (win.width() / win.height() < img.width() / img.height()) {
      return true;
    } else {
      return false;
    }
  }

  $('#image-modal').on('show.bs.modal', function() {
    var src = modalImage.attr('data-original');
    var win = $(window);
    var html = '';

    if (isUsingWidth(modalImage)) {
      html += '<img style="width:' + (win.width() - 80) + 'px;" src="' + src + '"/>';
    } else {
      html += '<img style="height:' + (win.height() - 80) + 'px;" src="' + src + '"/>';
    }

    $(this).find('.image').html(html);
  });

  $('#image-modal').on('click.bs.modal', function(event) {
    if (!$(event.target).is('#image-modal img')) {
      $('#image-modal').modal('hide');
    }
  });

  if ($('.build-head').hasClass('alert-info')) {
    // for chrome/safari
    // reference: http://stackoverflow.com/questions/15691569/javascript-issue-with-scrollto-in-chrome
    setTimeout(function() {
      window.scrollTo(0, 99999);
    }, 200);

    setTimeout(function() {
      location.reload();
    }, 10000);
  }

  // sidebar sticky
  $('#affix-sidebar').affix({ offset: { top: 106 } });

})();
