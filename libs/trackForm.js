(function(global) {
  'use strict';

  const patch = snabbdom.default.patch;
  const h = snabbdom.default.h;

  function fileOps(track, fn, refresh) {
    function onSave() {
      saveXML(track, fn);
    }

    function onLoad(fn, doc) {
      //console.log(fn, doc);
      refresh(-1, {action:'load', fn:fn, doc:doc});
    }

    return h('div', [
      h('input', {props:{type:'file'}, on:{change:loadXMLFact(onLoad)}}),
      fn,
      h('button', {on:{click:onSave}}, 'save')
    ]);
  }

  function header(mt, refresh) {
    const width = num(mt, 'width');
    const bgPath = str(mt, 'bg-path') || '';
    const bgScale = num(mt, 'bg-scale') || 1;
    const bgPosX = num(mt, 'bg-pos-x') || 0;
    const bgPosY = num(mt, 'bg-pos-y') || 0;
    //const steps = num(mt, 'profil steps length');
    function updateWidth(ev) { num(mt, 'width', ev.target.value); refresh(); }
    function updateBgPath(ev) { str(mt, 'bg-path', ev.target.value); refresh(); }
    function updateBgScale(ev) { num(mt, 'bg-scale', ev.target.value); refresh(); }
    function updateBgPosX(ev) { num(mt, 'bg-pos-x', ev.target.value); refresh(); }
    function updateBgPosY(ev) { num(mt, 'bg-pos-y', ev.target.value); refresh(); }
    return h('div.header', [
      h('label', 'width'), h('input', {props:{value:width, type:'number'}, on:{change:updateWidth}}), h('br'),
      h('label', 'bg path'), h('input', {props:{value:bgPath}, on:{change:updateBgPath}}), h('br'),
      h('label', 'bg scale'), h('input', {props:{value:bgScale, type:'number', min:0.01, step:0.1}, on:{change:updateBgScale}}), h('br'),
      h('label', 'bg position'),
      h('input', {props:{value:bgPosX, type:'number'}, on:{change:updateBgPosX}}),
      h('input', {props:{value:bgPosY, type:'number'}, on:{change:updateBgPosY}})
    ]);
  }

  function createBtns(idx, add) {
    return h('div.create-segment-buttons', [
      h('button', {attrs:{'data-type':'lft', 'data-index':idx}, on:{click:add}}, '+lft'),
      h('button', {attrs:{'data-type':'str', 'data-index':idx}, on:{click:add}}, '+str'),
      h('button', {attrs:{'data-type':'rgt', 'data-index':idx}, on:{click:add}}, '+rgt')
    ]);
  }

  function segments(segs, refresh) {
    function add(ev) {
      refresh(-1, {action:'add', index:ev.target.dataset.index, type:ev.target.dataset.type});
    }

    let children = [createBtns(0, add)];
    const allowRemoval = segs.length > 1;
    segs.forEach(function(s, idx) {
      const tp = str(s, 'type');
      if (tp === 'str') { children.push(straight(s, idx, refresh, allowRemoval)); }
      else if (tp === 'lft' || tp === 'rgt') { children.push(arc(s, idx, refresh, allowRemoval)); }
      else children.push('TODO: ' + tp);
      children.push(createBtns(idx+1, add));
    });

    return h('div.segments', children);
  }

  function straight(s, idx, refresh, allowRemoval) {
    function updateLg(ev) { num(s, 'lg', ev.target.value); refresh(idx); }
    function remove() { refresh(idx-1, {action:'remove', index:idx}); }
    const lg = num(s, 'lg');
    return h('div.segment', [
      h('div.title', [
        `straight (#${idx+1})`,
        allowRemoval ? h('button.delete-segment-button', {on:{click:remove}}, '-') : ''
      ]),
      h('label', 'width'),
      h('input', {props:{value:lg, type:'number'}, on:{change:updateLg}}), ' m'
    ]);
  }

  function arc(s, idx, refresh, allowRemoval) {
    function updateType(ev) { str(s, 'type', ev.target.value); refresh(idx); }
    function updateArc(ev) { num(s, 'arc', ev.target.value); refresh(idx); }
    function updateR0(ev) { num(s, 'radius', ev.target.value); refresh(idx); }
    function updateR1(ev) { num(s, 'end radius', ev.target.value); refresh(idx); }
    function remove() { refresh(idx-1, {action:'remove', index:idx}); }
    const tp = str(s, 'type');
    const arc = num(s, 'arc');
    const r0 = num(s, 'radius');
    let r1 = num(s, 'end radius');
    return h('div.segment', [
      h('div.title', [
        `arc (#${idx+1})`,
        allowRemoval ? h('button.delete-segment-button', {on:{click:remove}}, '-') : ''
      ]),
      h('label', 'direction'),
      h('select', {on:{change:updateType}},
        ['lft', 'rgt'].map(function(type) {
          return h('option', {props:{value:type, selected:type === tp}}, type);
        })
      ), h('br'),
      h('label', 'arc'),
      h('input', {props:{value:arc, type:'number'}, on:{change:updateArc}}), ' deg', h('br'),
      h('label', 'radius'),
      h('input', {props:{value:r0, type:'number'}, on:{change:updateR0}}), ' m', h('br'),
      h('label', 'end radius'),
      h('input', {props:{value:r1||'', type:'number'}, on:{change:updateR1}}), ' m'
    ]);
  }

  function createAttr(parentEl, name, val, unit) {
    const el = document.createElement('att' + (typeof val === 'number' ? 'num' : 'str'));
    el.setAttribute('name', name);
    el.setAttribute('val', val);
    if (unit !== undefined) {
      el.setAttribute('unit', unit);
    }
    parentEl.appendChild(el);
    return el;
  }

  function trackForm(track, fn, refreshTrackCb) {
    let selectedIndex = -1;

    refreshTrackCb(selectedIndex);

    let mt, segs;
    let root, newRoot;

    function tree() {
      mt = getMainTrackEl(track);
      segs = getTrackSegments(mt);

      newRoot = h('div#gui', [
        fileOps(track, fn, refresh),
        header(mt, refresh),
        segments(segs, refresh)
      ]);
      
      root = patch(root, newRoot);
    }

    function refresh(newSelectedIndex, op) {
      if (op) {
        switch (op.action) {
          case 'load':
            {
              fn = op.fn;
              track = op.doc;
              refreshTrackCb(-1, track);
            }
            break;
          case 'remove':
            {
              const s = segs[op.index];
              s.parentNode.removeChild(s);
            }
            break;
          case 'add':
            {
              const sectionEl = document.createElement('section');
              if (op.type === 'str') {
                createAttr(sectionEl, 'type', 'str');
                createAttr(sectionEl, 'lg', 50, 'm');
              }
              else {
                createAttr(sectionEl, 'type', op.type);
                createAttr(sectionEl, 'arc', 90, 'deg');
                createAttr(sectionEl, 'radius', 100, 'm');
                // createAttr(sectionEl, 'end radius', 100, 'm');
              }
              
              const p = segs[0].parentNode; // TODO if no segs!
              const sib = segs[op.index];
              if (sib) {
                p.insertBefore(sectionEl, sib);
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
