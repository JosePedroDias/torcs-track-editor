(function(global) {
  'use strict';

  function saveXML(xmlDoc, fileName) {
    const ctnEl = document.body;
    const markup = new XMLSerializer().serializeToString(xmlDoc);
    const b64 = btoa(markup);
    const aEl = document.createElement('a');
    aEl.setAttribute('download', fileName);
    aEl.href = 'data:text/xml;base64,\n' + b64;
    ctnEl.appendChild(aEl);
    aEl.click();
    setTimeout(function() {
      ctnEl.removeChild(aEl);
    }, 200);
  }

  function parseBlobIntoXML(blob, cb) {
    const fileName = blob.name;
    const reader = new FileReader();
    reader.addEventListener('loadend', function() {
      const s = reader.result;
      const parser = new DOMParser();
      const doc = parser.parseFromString(s, 'text/xml');
      cb(fileName, doc);
    });
    reader.readAsText(blob);
  };

  function loadXML(inputEl, cb) {
    inputEl.addEventListener('change', function() {
      const file0 = inputEl.files[0];
      parseBlobIntoXML(file0, cb);
    });
  }

  // to be used by snabbdom or similar (returns an onchange event handler)
  function onChangeLoadXmlEventHandlerFactory(cb) {
    return function(ev) {
      const inputEl = ev.target;
      const file0 = inputEl.files[0];
      parseBlobIntoXML(file0, cb);
    }
  }

  global.saveXML = saveXML;
  global.loadXML = loadXML;
  global.loadXMLFact = onChangeLoadXmlEventHandlerFactory;
})(this);
