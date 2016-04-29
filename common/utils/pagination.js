'use strict';

const RANGE = 2;

function *pagination(page, total) {
  const current = parseInt(page, 10) || 1;
  const data = {
    current: current,
    total: total || 1
  };
  const previous = current - 1;

  if (previous) {
    data.previous = previous;
  }
  const next = current + 1;

  if (next <= total) {
    data.next = next;
  }
  const start = current - RANGE;
  const end = current + RANGE + 1;
  data.start = start > 0 ? start : 1;
  data.end = total + 1 >= end ? end : total + 1;
  return data;
}

module.exports = pagination;
