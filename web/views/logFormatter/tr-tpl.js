'use strict';

const tplResult = v => {
  const result = [];

  v.split('<%').forEach(code => {
    if (code.indexOf('%>') > -1) {
      result.push(code.split('%>')[0]);
    }
  });

  return result;
};

const foldStart = v => {
  let cmd;
  try {
    cmd = tplResult(v)[0].replace(/_/g, ' ');
  } catch (e) {
    cmd = 'click to fold/open';
    console.log('parse foldStart failed: ', v, e.stack);
  }

  return `<div class="fold-wrap">${cmd} <span class="fold-wrap-date"></span></div><div class="fold-wrap-content">`;
};

const foldEnd = () => '</div>';

const timingStart = () => '';

const timingEnd = v => {
  // reliable_timing_end: <%$cmd%>, duration <%$timing%>
  const [cmd, timing] = tplResult(v);

  return `<li data-timing="${cmd}" data-timing-cmd="${timing}"></li>`;
};

const defaultTpl = (v, i) => `<li><div class="line">${i}</div><div class="content">${v}</div></li>`;

module.exports = {
  foldStart,
  foldEnd,
  timingStart,
  timingEnd,
  defaultTpl
};
