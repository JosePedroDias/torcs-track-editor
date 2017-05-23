(function(global) {
  'use strict';

  const patch = snabbdom.default.patch;
  const h = snabbdom.default.h;

  function header(mt, refresh) {
    const width = num(mt, 'width');
    const steps = num(mt, 'profil steps length');
    function updateWidth(ev) { num(mt, 'width', ev.target.value); refresh(); }
    return h('div.header', [
      h('label', 'width'),
      h('input', {props:{value:width}, on:{change:updateWidth}})
    ]);
  }

  function segments(segs, refresh) {
    function add() {
      refresh(-1, {action:'add', index:0});
    }
    const children = segs.map(function(s, idx) {
      const tp = str(s, 'type');
      if (tp === 'str') { return straight(s, idx, refresh); }
      if (tp === 'lft' || tp === 'rgt') { return arc(s, idx, refresh); }
      else return 'TODO: ' + tp;
    });
    children.unshift(h('button', {on:{click:add}}, '+'));
    return h('div', children);
  }

  function straight(s, idx, refresh) {
    function updateLg(ev) { num(s, 'lg', ev.target.value); refresh(idx); }
    function remove() { refresh(idx-1, {action:'remove', index:idx}); }
    const lg = num(s, 'lg');
    return h('div.segment', [
      h('bold', 'straight'), h('br'),
      h('label', 'width'),
      h('input', {props:{value:lg, type:'number'}, on:{change:updateLg}}), ' m',
      h('button', {on:{click:remove}}, '-')
    ]);
  }

  function arc(s, idx, refresh) {
    function updateArc(ev) { num(s, 'arc', ev.target.value); refresh(idx); }
    function updateR0(ev) { num(s, 'radius', ev.target.value); refresh(idx); }
    function updateR1(ev) { num(s, 'end radius', ev.target.value); refresh(idx); }
    function remove() { refresh(idx-1, {action:'remove', index:idx}); }
    const tp = str(s, 'type');
    const arc = num(s, 'arc');
    const r0 = num(s, 'radius');
    let r1 = num(s, 'end radius');
    let sign = (tp === 'rgt') ? -1 : 1;
    return h('div.segment', [
      h('bold', 'arc'), h('br'),
      h('label', 'arc'),
      h('input', {props:{value:arc, type:'number'}, on:{change:updateArc}}), ' deg', h('br'),
      h('label', 'radius'),
      h('input', {props:{value:r0, type:'number'}, on:{change:updateR0}}), ' m', h('br'),
      h('label', 'end radius'),
      h('input', {props:{value:r1||'', type:'number'}, on:{change:updateR1}}), ' m',
      h('button', {on:{click:remove}}, '-')
    ]);
  }

  function createAttr(parentEl, name, val, unit) {
    const el = document.createElement('att' + (typeof val === 'number' ? 'num' : 'str'));
    el.setAttribute('name', name);
    el.setAttribute('value', val);
    if (unit !== undefined) {
      el.setAttribute('unit', unit);
    }
    parentEl.appendChild(el);
    return el;
  }

  function trackForm(track, refreshTrackCb) {
    let selectedIndex = -1;

    refreshTrackCb(selectedIndex);

    let mt, segs;
    let root, newRoot;

    function tree() {
      mt = getMainTrackEl(track);
      segs = getTrackSegments(mt);

      newRoot = h('div#gui', [
        header(mt, refresh),
        segments(segs, refresh)
      ]);
      
      root = patch(root, newRoot);
    }

    function refresh(newSelectedIndex, op) {
      if (op) {
        switch (op.action) {
          case 'remove':
            {
              const s = segs[op.index];
              s.parentNode.removeChild(s);
            }
            break;
          case 'add':
            {
              const sectionEl = document.createElement('section');
              createAttr(sectionEl, 'type', 'str');
              createAttr(sectionEl, 'lg', 200, 'm');
              //createAttr(sectionEl, 'arc', 200, 'deg');
              //createAttr(sectionEl, 'radius', 200, 'm');
              //createAttr(sectionEl, 'end radius', 200, 'm');
              console.log(sectionEl);
              const p = segs[0].parentNode; // TODO if no segs!
              if (op.index <= segs.length) {
                p.insertBefore(sectionEl, segs[op.index]);
              }
              else {
                p.appendChild(sectionEl);
              }
            }
            break;
        }

        tree();
      }

      if (newSelectedIndex !== undefined) {
        selectedIndex = newSelectedIndex;
      }
      refreshTrackCb(selectedIndex);
    }

    root = document.getElementById('gui');

    tree();
  }

  global.trackForm = trackForm;
})(this);
