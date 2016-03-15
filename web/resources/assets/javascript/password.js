/* ================================================================
 * reliable-master by xdf(xudafeng[at]126.com)
 *
 * first created at : Tue Mar 17 2015 00:16:10 GMT+0800 (CST)
 *
 * ================================================================
 * Copyright xdf
 *
 * Licensed under the MIT License
 * You may not use this file except in compliance with the License.
 *
 * ================================================================ */

'use strict';

(function() {
  var csrf_token = $('#csrf_token').val();
  var sendEmail = $('#sendEmail');
  var resetPwd = $('#resetPwd');

  function precheck() {
    var email = $('input[name="email"]').prop('value');
    var result = {
      success: false,
      errMsg: ''
    };

    if (!email) {
      result.errMsg = 'Email address cannot be empty.';
      return result;
    }

    var email_filter = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
    if (!email_filter.test(email)) {
      result.errMsg = 'Email address is not in the correct format.';
      return result;
    }

    result.success = true;
    return result;
  }

  function precheckPwd() {
    var password = $('input[name="password"]').prop('value');
    var confirm = $('input[name="confirm"]').prop('value');
    var result = {
      success: false,
      errMsg: ''
    };

    if (!password) {
      result.errMsg = 'Password cannot be empty.';
      return result;
    } else if (!confirm) {
      result.errMsg = 'Confirm password cannot be empty.';
      return result;
    }

    var password_filter = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}/;
    if (!password_filter.test(password)) {
      result.errMsg = 'Password should at least six characters and contain one number, one lowercase, one uppercase letter.';
      return result;
    }

    if (password !== confirm) {
      result.errMsg = 'Password does not matches.';
      return result;
    }

    result.success = true;
    return result;
  }

  sendEmail.on('click', function() {
    var result = precheck();
    if (!result.success) {
      $('#dialog-content').text(result.errMsg || 'System Error');
      $('#dialog').modal('show');
      return false;
    }
    $.ajax({
      url: '/api/password/retake?_csrf=' + csrf_token,
      data: {
        email: $('input[name="email"]').prop('value')
      },
      async: false,
      method: 'post',
      success: function(d) {
        if (d.success) {
          $('#dialog-content').text('A confirm email has been sent to your email address, please click your inbox.');
          $('#dialog').modal('show');
        } else {
          $('#dialog-content').text(d.errMsg || 'System Error');
          $('#dialog').modal('show');
        }
      }
    });
    return false;
  });

  resetPwd.on('click', function() {
    var result = precheckPwd();
    if (!result.success) {
      $('#dialog-content').text(result.errMsg || 'System Error');
      $('#dialog').modal('show');
      return false;
    }
    $.ajax({
      url: '/api/password/reset' + location.search + '&_csrf=' + csrf_token,
      data: {
        password: $('input[name="password"]').prop('value')
      },
      async: false,
      method: 'post',
      success: function(d) {
        if (d.success) {
          location.href = '/login';
        } else {
          $('#dialog-content').text(d.errMsg || 'System Error');
          $('#dialog').modal('show');
        }
      }
    });
    return false;
  });
})();
