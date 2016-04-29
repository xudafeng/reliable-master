

'use strict';

let Util = {};

Util.ajax = function(url, successCallback, failCallback) {
  var request = new XMLHttpRequest();
  request.open('GET', url, true);

  request.onreadystatechange = function() {
    if (this.readyState === 4) {

      if (this.status >= 200 && this.status < 400) {
        successCallback(this.responseText);
      } else {
        failCallback();
      }
    }
  };

  request.send();
  request = null;
};

Util.ready = function(callback) {
  if (document.readyState !== 'loading') {
    callback();
  } else if (document.addEventListener) {
    document.addEventListener('DOMContentLoaded', callback);
  } else {
    document.attachEvent('onreadystatechange', function() {

      if (document.readyState !== 'loading') {
        callback();
      }
    });
  }
};

Util.mixin = function(dest) {
  var sources = Array.prototype.slice.call(arguments, 1);

  for (var i = 0; i < sources.length; i++) {
    var src = sources[i];
    for (var key in src) {

      if (!dest[key]) {
        dest[key] = src[key];
      }
    }
  }
};

Util.getUrlParams = function(k) {
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
};

Util.groupBy = function(arr, func) {
  var result = {};
  arr.forEach(function(obj) {
    var key = func(obj);
    if (result[key]) {
      result[key].push(obj);
    } else {
      result[key] = [obj];
    }
  });
  return result;
};

Util.map = function(obj, func) {
  if (Array.isArray(obj)) {
    return obj.map(func);
  } else {
    return Object.keys(obj).map(function(key) {
      return func(obj[key], key);
    });
  }
};

Util.sortBy = function(arr, func) {
  return arr.sort(function(a, b) {
    return func(a) - func(b);
  });
};

Util.forEach = function(arr, func) {
  arr.forEach(function(o, i, self) {
    func(o, i, self);
  });
  return arr;
};

Util.max = function(arr, func) {
  return Math.max.apply(null, arr.map(func));
};

Util.filter = function(arr, func) {
  return arr.filter(func);
};

Util.format = function(date, formatStr) {
  var d = new Date(date);
  // TODO for now just support 'YYYY MM DD'
  var yyyy = d.getFullYear().toString();
  var mm = (d.getMonth() + 1).toString();
  var dd = d.getDate().toString();
  return yyyy + ' ' + (mm[1] ? mm : '0' + mm[0]) + ' ' + (dd[1] ? dd : '0' + dd[0]);
};

module.exports = Util;
