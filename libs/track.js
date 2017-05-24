(function(global) {
  'use strict';

  function toArr(lst) {
    return Array.prototype.slice.apply(lst);
  }

  function _str(el, nodeName, name, val) {
    let v = el.querySelector(nodeName + '[name="' + name + '"]');
    if (val === undefined) {
      return v ? v.getAttribute('val') : undefined;
    }
    if (!v) {
      v = document.createElement(nodeName);
      v.setAttribute('name', name);
      el.appendChild(v);
    }
    v.setAttribute('val', val);
  }

  function str(el, name, val) {
    if (val === undefined) {
      return _str(el, 'attstr', name);
    }
    _str(el, 'attstr', name, val);
  }

  function num(el, name, val) {
    if (val === undefined) {
      return parseFloat( _str(el, 'attnum', name) );
    }
    _str(el, 'attnum', name, val);
  }

  function getMainTrackEl(rootTrackEl) {
    return rootTrackEl.querySelector('section[name="Main Track"]');
  }

  function getTrackSegments(mainTrackEl) {
    let ts = mainTrackEl.querySelector('section[name="Track Segments"]');
    if (!ts) {
      ts = mainTrackEl.querySelector('section');
    }
    let segs = toArr( ts.childNodes );
    segs = segs.filter(function(n) { return n.nodeType === 1; })
    return segs;
  }

  function parseTrack(track, ctx, scale, center, selectedSegment) {
    const mt = getMainTrackEl(track);
    const roadWidth = num(mt, 'width');

    const bgPath = str(mt, 'bg-path');
    const bgScale = num(mt, 'bg-scale');
    const bgPosX = num(mt, 'bg-pos-x');
    const bgPosY = num(mt, 'bg-pos-y');

    const r = road(ctx, roadWidth, scale, center, bgPath, bgScale, [bgPosX, bgPosY]);

    r.clear();

    //const steps = num(mt, 'profil steps length');
    const segs = getTrackSegments(mt);

    
    ctx.lineWidth = 1;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.font = '9px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    segs.forEach(function(s, idx) {
      const clr = (idx === selectedSegment) ? 'red' : 'black';
      r.color(clr, clr);

      r.arrow(10, 3, 30);
      r.label(idx + 1);

      const tp = str(s, 'type');
      if (tp === 'str') {
        const lg = num(s, 'lg'); // length, in m
        r.straight(lg);
      }
      else if (tp === 'rgt' || tp === 'lft') {
        const arc = num(s, 'arc'); // arc, in degrees
        const r0 = num(s, 'radius'); // start radius, in m
        let r1 = num(s, 'end radius'); // end radius, in m
        let sign = (tp === 'rgt') ? -1 : 1;
        if (isNaN(r1)) { r1 = r0; }
        r.arc(arc*sign, r0, r1);
      }
      else {
        console.log('todo', s);
      }
    });
  }

  function computeScale(track, canvasSize) {
    // fake render to get bounding box
    const fCtx = fakeCtx();
    parseTrack(track, fCtx, 1, [0, 0]);
    const bbox = fCtx.getBbox();

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
    const scale = (canvasSize - 10) / maxTrackDim; // the -10 is to allow some border/stroke width
    const center = [
      canvasSize/2 - trackCenter[0]*scale,
      canvasSize/2 - trackCenter[1]*scale
    ];
    return {
      scale: scale,
      center: center
    };
  }

  function renderTrack(track) {
    const canvasSize = 800;
    const sc = computeScale(track, canvasSize);

    // setup canvas
    const cEl = document.createElement('canvas');
    cEl.width = canvasSize;
    cEl.height = canvasSize;
    document.body.appendChild(cEl);
    const ctx = cEl.getContext('2d');

    // do the rendering
    parseTrack(track, ctx, sc.scale, sc.center, -1);
  }

  function editTrack(track) {
    console.log(track);

    const canvasSize = 800;

    // setup canvas
    const cEl = document.createElement('canvas');
    cEl.width = canvasSize;
    cEl.height = canvasSize;
    document.body.appendChild(cEl);
    const ctx = cEl.getContext('2d');

    // do the rendering
    function refreshTrackCb(selectedIndex) {
      const sc = computeScale(track, canvasSize);
      parseTrack(track, ctx, sc.scale, sc.center, selectedIndex);
    }

    trackForm(track, refreshTrackCb);
  }

  global.parseTrack = parseTrack;
  global.renderTrack = renderTrack;
  global.editTrack = editTrack;

  global.getMainTrackEl = getMainTrackEl ;
  global.getTrackSegments = getTrackSegments;
  global.num = num;
  global.str = str;
})(this);
