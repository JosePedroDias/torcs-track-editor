'use strict';

const THRESH = 1E-8;

function s(o) { return JSON.stringify(o); }

function assEq(a, b) {
  if (a !== b) {
    throw new Error(`assertEqual: expected ${s(a)} but got ${s(b)}`);
  }
}

function assT(a) {
  if (!a) {
    throw new Error(`assertTrue: got ${s(a)} but got ${s(b)}`);
  }
}

function assN(a, b) {
  if (Math.abs(a - b) > THRESH) {
    throw new Error(`assertEqualish: expected ${s(a)} but got ${s(b)}`);
  }
}
