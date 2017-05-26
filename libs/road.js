function road(ctx, cfg) {//} W, SCALE, POS, bgPath, bgScale, bgPos) {
  'use strict';

  const D2R = Math.PI / 180;

  const W = cfg.roadWidth;
  const SCALE = cfg.scale;
  const POS = cfg.center;
  const BG = cfg.bg;

  function setScale() {
    ctx.setTransform(1, 0, 0, 1, 0, 0);

    if (!SCALE) {
      SCALE = 1;
    }
    else {
      ctx.scale(SCALE, SCALE);
    }
  }

  setScale();

  

  const w = W/2;
  let t = turtle(ctx);
  t = t.setPos(POS[0]/SCALE, POS[1]/SCALE);//.turn(45);

  function st(a) {
    return Math.abs( Math.floor(a/4) );
  }

  const r = {
    clear: function() {
      t.clear();
      if (BG.path) {
        ctx.translate(POS[0]/SCALE, POS[1]/SCALE);
        ctx.scale(BG.scale, BG.scale);
        ctx.rotate(BG.rotation * D2R);
        ctx.translate(BG.position[0], BG.position[1]);
        let imgEl = document.querySelector('img');
        if (!imgEl) {
          imgEl = new Image();
          imgEl.style.visibility = 'hidden';
          document.body.appendChild(imgEl);
        }
        if (BG.path !== imgEl.src) {
          imgEl.src = BG.path;
        }
        ctx.drawImage(imgEl, BG.position[0], BG.position[1]);      
        setScale();
      }
      return r;
    },
    color: function(sClr, fClr) {
      t.color(sClr, fClr);
      return r;
    },
    label: function(txt) {
      const p = t.getPos();
      ctx.fillText(txt, p[0], p[1]);
      return r;
    },
    arrow: function(len, len2, angle) {
      t
      .push()
      .straight(len)
      .push()
      .turn(180+angle)
      .straight(len2)
      .pop()
      .turn(180-angle)
      .straight(len2)
      .pop();
      return r;
    },
    straight: function(l) {
      t = t
      .push()
      .left(w, 1).straight(l)
      .pop(1)
      .left(-w, 1).straight(l)
      .pop()
      .straight(l, 1);
      return r;
    },
    arc: function(a, r0, r1) {
      const sign = (a < 0) ? -1 : 1;
      t = t
      .push()
      .left(sign*w, 1).arc(a, r0+w, r1+w, st(a))
      .pop(1)
      .left(sign*-w, 1).arc(a, r0-w, r1-w, st(a))
      .pop()
      .arc(a, r0, r1, st(a), 1);
      return r;
    }
  };

  return r;
}