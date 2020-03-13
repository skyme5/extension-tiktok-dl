var url = browser.runtime.getURL("scripts/tiktok-inject.js");

function injectInterceptScript (data) {
  var xhrOverrideScript = document.createElement('script')
  xhrOverrideScript.type = 'text/javascript'
  xhrOverrideScript.innerHTML = data;
  document.head.prepend(xhrOverrideScript)
}

function checkForDOM (data) {
  if (document.head) {
    injectInterceptScript(data)
  } else {
    setTimeout(() => { checkForDOM() }, 1)
  }
}

fetch(url)
.then(e => e.text())
.then(e => {
  checkForDOM(e)
})
