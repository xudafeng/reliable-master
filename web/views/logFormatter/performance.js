/* ================================================================
 * reliable-master by zichen.zzc(zichen.zzc[at]gmail.com)
 *
 * first created at : Tue Nov 20 2015 17:16:10 GMT+0800 (CST)
 *
 * ================================================================
 * Copyright zichen.zzc
 *
 * Licensed under the MIT License
 * You may not use this file except in compliance with the License.
 *
 * ================================================================ */

'use strict';

const _ = require('xutil');

module.exports = function(log) {
  try {
    const res = JSON.parse(log);
    const pageTitle = res.title;
    const pageURL = res.path;
    const rules = res.rules;
    const groupRules = _.groupBy(rules, rule => rule.type);

    let template = `<caption><%- pageTitle %>: <%- pageURL %></caption>
      <table border="1">
        <tr>
          <th>Name</th>
          <th>Rule</th>
          <th>Result</th>
          <th>Data</th>
        </tr>
        <% _.mapKeys(groupRules, (val, key) => {
            var data;
            var result;
            switch(key) {
              case 'Load Time':
                data = val[0].value + 'ms';
                result = val[0].result ? '✔' : '✘';
                break;
              case 'Invalid Request':
                data = val.length;
                result = '✘';
                break;
              case 'Oversize':
                var count = val.length;
                var successCount = val.filter(item => item.result).length;
                var failCount = count - successCount;
                data = successCount + '/' + count;
                result = failCount ? '✘' : '✔';
                break;
              default:
                data = '';
                result = '';
                break;
            }
            %><tr><td><%- key %></td><%
            %><td><%- val[0].rule %></td><%
            %><td><%- result %></td><%
            %><td><%- data %></td></tr><%
        });%>
      </table>`;

    if (rules.filter(rule => !rule.result).length > 0) {
      template += `<caption>Details:</caption>
        <table border="1">
          <tr>
            <th>Item</th>
            <th>Type</th>
            <th>Message</th>
          </tr>

          <% _.forEach(rules, (rule) => {
            if (!rule.result) {
              %><tr><td><%- rule.item %></td><%
              %><td><%- rule.type %></td><%
              %><td><%- rule.message || rule.value %></td></tr><%
            }
          });%>
        </table>`;
    }
    const compiled = _.template(template);
    return compiled({
      pageTitle,
      pageURL,
      groupRules,
      rules
    });
  } catch(e) {
    console.log(e);
    return '';
  }
};
