function ajax(url, cb) {
    'use strict';
    var xhr = new XMLHttpRequest();
    xhr.open('GET', url, true);
    var cbInner = function() {
        if (xhr.readyState === 4 && xhr.status > 199 && xhr.status < 300) {
            return cb(xhr.responseXML);
        }
        cb('error requesting ' + o.url);
    };
    xhr.onload  = cbInner;
    xhr.onerror = cbInner;
    xhr.send(null);
}