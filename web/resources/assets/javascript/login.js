

'use strict';

(function () {
  var csrf_token = $('#csrf_token').val();
  var submit_btn = $('#submit_register');

  function precheck() {
    var user_name = $('input[name="user_name"]').prop('value');
    var password = $('input[name="password"]').prop('value');
    var result = {
      success: false,
      errMsg: ''
    };

    if (!user_name) {
      result.errMsg = 'User id cannot be empty.';
      return result;
    } else if (!password) {
      result.errMsg = 'Password cannot be empty.';
      return result;
    }

    result.success = true;
    return result;
  }

  function _getUrlParams(k) {
    var params = {};
    var url = location.href;
    var idx = url.indexOf('?');

    if (idx > 0) {
      var queryStr = url.substring(idx + 1);
      var args = queryStr.split('&');
      for (var i = 0; i < args.length; i++) {
        var a = args[i];
        var nv = args[i] = a.split('=');
        params[nv[0]] = nv.length > 1 ? nv[1] : true;
      }
    }
    return params[k];
  }

  submit_btn.on('click', function () {
    var result = precheck();
    if (!result.success) {
      $('#dialog-content').text(result.errMsg || 'System Error');
      $('#dialog').modal('show');
      return false;
    }
    $.ajax({
      url: '/api/login' + '?_csrf=' + csrf_token,
      data: {
        user_name: $('input[name="user_name"]').prop('value'),
        password: $('input[name="password"]').prop('value')
      },
      async: false,
      method: 'post',
      success: function (d) {
        if (d.success) {
          var redirect = _getUrlParams('redirect');
          if (redirect) {
            redirect = decodeURIComponent(redirect);
          }
          location.href = redirect || '/dashboard';
        } else {
          $('#dialog-content').text(d.errMsg || 'System Error');
          $('#dialog').modal('show');
        }
      }
    });
    return false;
  });
})();
