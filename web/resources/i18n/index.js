'use strict';

const getArchive = (_ => {
  const archive = new Map();
  return {
    get(locale) {
      if (archive.get(locale)) {
        return archive.get(locale);
      }

      const text = require(`./${locale}`);
      Object.keys(text).forEach(key => {
        this.add(locale, key, text[key]);
      });

      return archive.get(locale);
    },

    add(locale, key, value) {
      key = key.trim();
      value = value.trim();

      !archive.has(locale) && archive.set(locale, new Map());
      archive.get(locale).set(key, value);
    },

    addPluginText(locale, text) {
      if (!archive.has(locale)) {
        this.get(locale);
      }

      Object.keys(text).forEach(key => {
        this.add(locale, key, text[key]);
      });
    }
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

module.exports = locale => ({
  gettext: function(name) {
    const archive = getArchive.get(locale);
    const args = Array.prototype.slice.call(arguments, 1);
    return formatI18n(archive.get(name), args || []) || name;
  },
  addPluginText: getArchive.addPluginText.bind(getArchive)
});
