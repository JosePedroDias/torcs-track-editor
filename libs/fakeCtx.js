function fakeCtx() {
  'use strict';

  const bbox = {
    x0:  Infinity,
    x1: -Infinity,
    y0:  Infinity,
    y1: -Infinity
  };

  function noop() {}

  function update(x, y) {
    if (x < bbox.x0) { bbox.x0 = x; }
    if (x > bbox.x1) { bbox.x1 = x; }
    if (y < bbox.y0) { bbox.y0 = y; }
    if (y > bbox.y1) { bbox.y1 = y; }
  }

  const api = {
    scale: noop,
    translate: noop,
    beginPath: noop,
    stroke: noop,
    setTransform: noop,
    drawImage: noop,
    fillText: noop,
    moveTo: update,
    lineTo: update,
    getBbox: function() { return bbox; }
  };

  return api;
}
