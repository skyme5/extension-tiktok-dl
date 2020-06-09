var url = browser.runtime.getURL("scripts/tiktok-inject.js");

function injectInterceptScript (data) {
  var xhrOverrideScript = document.createElement('script')
  xhrOverrideScript.type = 'text/javascript'
  xhrOverrideScript.innerHTML = data;
  document.body.append(xhrOverrideScript)
}

function checkForDOM (data) {
  if (document.body) {
    injectInterceptScript(data)
  } else {
    setTimeout(() => {checkForDOM(data)}, 1000);
  }
}

fetch(url)
.then(e => e.text())
.then(e => {
  checkForDOM(e)
})
