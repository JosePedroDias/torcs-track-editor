(function(global) {
  'use strict';

  const patch = snabbdom.default.patch;
  const h = snabbdom.default.h;

  function header(mt, refresh) {
    const width = num(mt, 'width');
    const steps = num(mt, 'profil steps length');
    function updateWidth(ev) { num(mt, 'width', ev.target.value); refresh(); }
    return h('div', [
      h('label', 'width'),
      h('input', {props:{value:width}, on:{change:updateWidth}})
    ]);
  }

  function segments(segs, refresh) {
    const children = segs.map(function(s) {
      const tp = str(s, 'type');
      if (tp === 'str') { return straight(s, refresh); }
      if (tp === 'lft' || tp === 'rgt') { return arc(s, refresh); }
      else return 'TODO: ' + tp;
    });
    return h('div', children);
  }

  function straight(s, refresh) {
    function updateLg(ev) { num(s, 'lg', ev.target.value); refresh(); }
    const lg = num(s, 'lg');
    return h('div', [
      h('bold', 'straight'), h('br'),
      h('label', 'width'),
      h('input', {props:{value:lg}, on:{change:updateLg}}), ' m'
    ]);
  }

  function arc(s, refresh) {
    function updateArc(ev) { num(s, 'arc', ev.target.value); refresh(); }
    function updateR0(ev) { num(s, 'radius', ev.target.value); refresh(); }
    function updateR1(ev) { num(s, 'end radius', ev.target.value); refresh(); }
    const tp = str(s, 'type');
    const arc = num(s, 'arc');
    const r0 = num(s, 'radius');
    let r1 = num(s, 'end radius');
    let sign = (tp === 'rgt') ? -1 : 1;
    return h('div', [
      h('bold', 'arc'), h('br'),
      h('label', 'arc'),
      h('input', {props:{value:arc}, on:{change:updateArc}}), ' deg', h('br'),
      h('label', 'radius'),
      h('input', {props:{value:r0}, on:{change:updateR0}}), ' m', h('br'),
      h('label', 'end radius'),
      h('input', {props:{value:r1||''}, on:{change:updateR1}}), ' m'
    ]);
  }

  function trackForm(track, refreshTrackCb) {
    let selectedIndex = -1;

    refreshTrackCb(selectedIndex);

    function refresh(newSelectedIndex) {
      if (newSelectedIndex !== undefined) {
        selectedIndex = newSelectedIndex;
      }
      refreshTrackCb(selectedIndex);
    }

    const mt = getMainTrackEl(track);
    const segs = getTrackSegments(mt);

    let root = document.getElementById('gui');

    let newRoot = h('div', [
      header(mt, refresh),
      segments(segs, refresh)
    ]);
    
    root = patch(root, newRoot);
  }

  global.trackForm = trackForm;
})(this);
