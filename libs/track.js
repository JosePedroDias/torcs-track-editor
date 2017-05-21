(function(global) {
  'use strict';

  const SCALE = 1;

  function toArr(lst) {
    return Array.prototype.slice.apply(lst);
  }

  function _str(el, nodeName, name) {
    const v = el.querySelector(nodeName + '[name="' + name + '"]');
    return v ? v.getAttribute('val') : undefined;
  }

  function str(el, name) {
    return _str(el, 'attstr', name);
  }

  function num(el, name) {
    return parseFloat( _str(el, 'attnum', name) );
  }

  function parseTrack(track, ctx, scale, center, selectedSegment) {
    //console.log(track);
    const mt = track.querySelector('section[name="Main Track"]');

    const roadWidth = num(mt, 'width');
    const steps = num(mt, 'profil steps length');
    //console.log('roadWidth', roadWidth);
    //console.log('steps', steps);
    
    let ts = mt.querySelector('section[name="Track Segments"]');
    if (!ts) {
      ts = mt.querySelector('section');
    }
    let segs = toArr( ts.childNodes );
    segs = segs.filter(function(n) { return n.nodeType === 1; })
    //console.log(segs);

    const r = road(ctx, roadWidth, scale, center);
    ctx.lineWidth = 2;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    r.clear();
    segs.forEach(function(s, idx) {
      const clr = (idx === selectedSegment) ? 'red' : 'black';
      r.color(clr);

      const tp = str(s, 'type');
      if (tp === 'str') {
        //console.log(s);
        const lg = num(s, 'lg'); // length, in m
        r.straight(lg);
      }
      else if (tp === 'rgt' || tp === 'lft') {
        //console.log(s);
        const arc = num(s, 'arc'); // arc, in degrees
        const r0 = num(s, 'radius'); // start radius, in m
        let r1 = num(s, 'end radius'); // end radius, in m
        let sign = (tp === 'rgt') ? -1 : 1;
        if (isNaN(r1)) { r1 = r0; }
        else {
          //console.log('arc: %s | r0: %s | r1: %s', arc, r0, r1);
        }
        r.arc(arc*sign, r0, r1);
      }
      else {
        //console.log('todo', s);
      }
      //console.log(s, tp);
    });
  }

  function renderTrack(track) {
    // first run, to assert track limits
    const fCtx = fakeCtx();
    parseTrack(track, fCtx, 1, [0, 0]);
    const bbox = fCtx.getBbox();
    //console.log('bbox', bbox);

    // compute dims and position
    const trackCenter = [
      (bbox.x0 + bbox.x1) / 2,
      (bbox.y0 + bbox.y1) / 2
    ];
    const trackDims = [
      bbox.x1 - bbox.x0,
      bbox.y1 - bbox.y0
    ];
    const maxTrackDim = Math.max.apply(null, trackDims);
    //console.log('trackCenter', trackCenter);
    //console.log('trackDims', trackDims);
    const W = 800;
    const scale = (W - 10) / maxTrackDim; // the -10 is to allow some border/stroke width
    const center = [
      W/2 - trackCenter[0]*scale,
      W/2 - trackCenter[1]*scale
    ];
    //console.log('scale', scale);
    //console.log('center', center);

    // setup canvas
    const cEl = document.createElement('canvas');
    cEl.width = W;
    cEl.height = W;
    document.body.appendChild(cEl);
    const ctx = cEl.getContext('2d');

    // do the rendering
    parseTrack(track, ctx, scale, center, -1);
  }

  global.parseTrack = parseTrack;
  global.renderTrack = renderTrack;
})(this);
