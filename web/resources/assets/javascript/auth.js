'use strict';

(function() {
  var csrf_token = $('#csrf_token').val();
  var submit_btn = $('#submit_register');

  function precheck() {
    var user_name = $('input[name="user_name"]').prop('value');
    var nick_name = $('input[name="nick_name"]').prop('value');
    var password = $('input[name="password"]').prop('value');
    var email = $('input[name="email"]').prop('value');
    var result = {
      success: false,
      errMsg: ''
    };

    if (!user_name) {
      result.errMsg = 'User id cannot be empty.';
      return result;
    } else if (!nick_name) {
      result.errMsg = 'Nick name cannot be empty.';
      return result;
    }else if (!password) {
      result.errMsg = 'Password cannot be empty.';
      return result;
    } else if (!email) {
      result.errMsg = 'Email address cannot be empty.';
      return result;
    }

    var email_filter = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
    if (!email_filter.test(email)) {
      result.errMsg = 'Email address is not in the correct format.';
      return result;
    }

    var password_filter = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}/;

    if (!password_filter.test(password)) {
      result.errMsg = 'Password should at least six characters and contain one number, one lowercase, one uppercase letter.';
      return result;
    }

    result.success = true;
    return result;
  }

  submit_btn.on('click', function() {
    var result = precheck();

    if (!result.success) {
      $('#dialog-content').text(result.errMsg || 'System Error');
      $('#dialog').modal('show');
      return false;
    }
    $.ajax({
      url: '/api/auth' + '?_csrf=' + csrf_token,
      data: {
        user_name: $('input[name="user_name"]').prop('value'),
        nick_name: $('input[name="nick_name"]').prop('value'),
        oauth_id: $('input[name="oauth_id"]').prop('value'),
        password: $('input[name="password"]').prop('value'),
        email: $('input[name="email"]').prop('value')
      },
      async: false,
      method: 'post',
      success: function(d) {
        if (d.success) {
          location.href = d.redirect || '/dashboard';
        } else {
          $('#dialog-content').text(d.errMsg || 'System Error');
          $('#dialog').modal('show');
        }
      }
    });
    return false;
  });
})();
