'use strict';

var EOL = require('os').EOL;
var Convert = require('ansi-to-html');

var screenshot = require('./screenshot');
var performance = require('./performance');
var trTpl = require('./tr-tpl');

var perfFragments;
var convert = new Convert();

function handler(type, log) {
  if (typeof type !== 'string') {
    throw new TypeError('type must be string.');
  }
  if (typeof log !== 'string') {
    throw new TypeError('log must be string.');
  }
  type = type.trim().toLowerCase();
  log = log.trim();
  switch (type) {
    case 'screenshot':
      return screenshot(log);
      break;
    case 'performance':
      perfFragments += performance(log);
      return ' ';
      break;
    case 'chart':
      return ' ';
      break;
    default:
      return '';
  }
}

function hasPerformanceData(logs) {
  var perfPattern = /\<\# performance[\s\S]*\#\>/g;
  return perfPattern.test(logs);
}

function tableWrap(raw) {
  let i = 0;

  return raw.split('\n').map(v => {
    if (v.trim()) {
      if (v.indexOf('reliable_timing_start') > -1) {
        return trTpl.timingStart();
      }

      if (v.indexOf('reliable_timing_end') > -1) {
        return trTpl.timingEnd(v);
      }

      if (v.indexOf('reliable_fold:start') > -1) {
        return trTpl.foldStart(v);
      }

      if (v.indexOf('reliable_fold:end') > -1) {
        return trTpl.foldEnd(v);
      }

      i++;
      return trTpl.defaultTpl(v, i);
    }
  });
}

function beautify(logs) {
  const raw = convert.toHtml(logs).replace(/\n+/g, '\n\n');
  const table = tableWrap(raw);
  return table.join('');
}

function format(logs) {
  logs = beautify(logs);
  var pattern = /\<\#([\s\S]*?)\#\>/g;
  perfFragments = hasPerformanceData(logs) ? EOL + '<p>Performance Table:</p>' : '';
  return (logs.replace(pattern, function(matchStr, identifyStr) {
    var arr = identifyStr.split('|');
    var type = arr[0];
    var log = arr[1];
    if (type && log) {
      var res = handler(type, log);
      if (res) {
        return res.trim();
      }
    }
    return matchStr;
  }) + perfFragments).replace(/\n{2,}/g, '\n\n');
}

module.exports = format;
