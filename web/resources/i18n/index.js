'use strict';

var fs = require('fs');
var os = require('os');
var path = require('path');

var getArchive = (function() {
  var archive = {};
  return function(locale) {
    if (archive[locale]) {
      return archive[locale];
    }
    archive[locale] = {};
    fs.readFileSync(path.join(__dirname, `${locale}.properties`), 'utf8')
      .split(os.EOL)
      .forEach(i => {
        var item = i.split('=');

        if (item.length === 2) {
          var left = item[0].trim();
          var right = item[1].trim();
          archive[locale][left] = right;
        }
      });
    return archive[locale];
  };
})();

function formatI18n(content, args) {
  if (!content) {
    return null;
  }

  for (let i = 0; i < args.length; i++) {
    if (args[i] !== null) {
      content = content.replace(new RegExp('\\{' + i + '\\}', 'g'), args[i]);
    }
  }

  return content;
}

module.exports = function(locale) {
  return function(name) {
    var archive = getArchive(locale);
    var args = Array.prototype.slice.call(arguments, 1);
    return formatI18n(archive[name], args || []) || name;
  };
};
