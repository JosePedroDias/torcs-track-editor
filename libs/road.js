function road(ctx, W, SCALE, POS) {
  'use strict';

  if (!SCALE) {
    SCALE = 1;
  }
  else {
    ctx.scale(SCALE, SCALE);
  }

  const w = W/2;
  let t = turtle(ctx);
  t = t.setPos(POS[0]/SCALE, POS[1]/SCALE);//.turn(45);

  function st(a) {
    return Math.abs( Math.floor(a/4) );
  }

  const r = {
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