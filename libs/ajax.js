function ajax(url, cb) {
  'use strict';
  const xhr = new XMLHttpRequest();
  xhr.open('GET', url, true);
  function cbInner() {
    if (xhr.readyState === XMLHttpRequest.DONE && xhr.status > 199 && xhr.status < 300) {
      return cb(null, xhr.responseXML);
    }
    cb('error requesting ' + o.url);
  };
  xhr.onload  = cbInner;
  xhr.onerror = cbInner;
  xhr.send(null);
}