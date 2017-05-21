'use strict';

const PI = Math.PI;
const sin = Math.sin;
const cos = Math.cos;
const D2R = PI / 180;
const R2D = 180 / PI;
const D90 = PI / 2;

function times(n) {
  return new Array(n).fill(0).map(function(_, i) { return i; });
}

function forward(l, s0) { // in the direction of s0.a
  return {
    x: s0.x + l * cos(s0.a),
    y: s0.y + l * sin(s0.a),
    a: s0.a
  };
}

function turn(da, s0) { // turn "left", CCW (right in canvas)
  return {
    x: s0.x,
    y: s0.y,
    a: s0.a + da
  };
}

function right(l, s0) { // turn 90R > fw l > turn 90L
  return turn(-D90, forward(l, turn(D90, s0) ) );
}

function left(l, s0) { // turn 90L > fw l > turn 90R
  return turn(D90, forward(l, turn(-D90, s0) ) );
}

function arcRight(da, r0, r1, s0) { // right r0 > turn da > left r1
  return left(r1, turn(da, right(r0, s0) ) );
}

function arcLeft(da, r0, r1, s0) { // left r0 > turn -da > left r1
  return right(r1, turn(-da, left(r0, s0) ) );
}

function clamp(n) {
  if (n < 0) { return 0; }
  if (n > 1) { return 1; }
  return n;
}
function lerp(a, b, i) {
  i = clamp(i);
  return (1-i)*a + i*b;
}

function turtle(ctx) {
  let s0 = {x:0, y:0, a:0};
  const history = [];

  const t = {
    setPos: function(x, y) {
      s0 = {x:x, y:y, a:s0.a};
      return t;
    },
    setAngle: function(a) {
      s0 = {x:s0.x, y:s0.y, a:a};
      return t;
    },
    getPos: function() {
      return [s0.x, s0.y];
    },
    getAngle: function() {
      return s0.a;
    },
    log: function() {
      console.log(s0);
      return t;
    },
    turn: function(da) { // turn is CW because canvas referential
      s0 = turn(D2R*da,s0);
      return t;
    },
    straight: function(l, noDraw) {
      if (!noDraw) {
        ctx.beginPath();
        ctx.moveTo(s0.x, s0.y);
      }
      s0 = forward(l, s0);
      if (!noDraw) {
        ctx.lineTo(s0.x, s0.y);
        ctx.stroke();
      }
      return t;
    },
    left: function(l, noDraw) {
      if (!noDraw) {
        ctx.beginPath();
        ctx.moveTo(s0.x, s0.y);
      }
      s0 = left(l, s0);
      if (!noDraw) {
        ctx.lineTo(s0.x, s0.y);
        ctx.stroke();
      }
      return t;
    },
    arc: function(da, r0, r1, steps, noDraw) {
      const sign = (da < 0) ? -1 : 1;
      da = Math.abs(D2R * da);
      const dda = da / (steps-1);
      if (!noDraw) {
        ctx.beginPath();
        ctx.moveTo(s0.x, s0.y);
      }
      times(steps).forEach(function(i) {
        const t = i / steps;
        const r = lerp(r0, r1, t);
        const l = da * r / steps;
        s0 = forward(l, s0);
        if (i < steps-1) {
          s0 = turn(sign * dda, s0);
        }
        if (!noDraw) {
          ctx.lineTo(s0.x, s0.y);
        }
      });
      if (!noDraw) {
        ctx.stroke();
      }
      return t;
    },
    color: function(clr) {
      ctx.strokeStyle = clr;
      return t;
    },
    push: function() {
      history.push(s0);
      return t;
    },
    pop: function(restoreButKeep) {
      if (restoreButKeep) {
        s0 = history[ history.length - 1 ];
      } else {
        s0 = history.pop();
      }
      return t;
    }
  };

  return t;
}