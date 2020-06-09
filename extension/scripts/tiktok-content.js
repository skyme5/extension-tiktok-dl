const REQUEST_MEDIA_DOWNLOAD_URL = "http://localhost:3234/url";
const TITOK_URL_SELECTOR = ".video-feed-item-wrapper";
const TITOK_URL_DONE = "tdl";
var HAS_MORE = true;

function makeRequest(data) {
    chrome.runtime.sendMessage({
            action: "request",
            url: data.requestUrl,
            type: "POST",
            data: data.requestData,
        },
        function(response) {}
    );
}

function processInputResponse(url) {
    makeRequest({
        requestUrl: REQUEST_MEDIA_DOWNLOAD_URL,
        requestData: {
            url: url,
        },
    });
}

function processInput() {
    document.querySelectorAll(TITOK_URL_SELECTOR).forEach((link) => {
				if(!link.classList.contains(TITOK_URL_DONE)) {
					link.classList.add(TITOK_URL_DONE);
					processInputResponse(link.href);
				}
    });
}

function isAutoDownload() {
    return window.location.href.includes("autoDownload=true");
}

function downloadStart() {
  setInterval(() => {
        processInput();
        var feed = document.querySelector(".video-feed");
        if (HAS_MORE && feed !== null) window.scrollTo(0, feed.scrollHeight);
    }, 1500);
}

// var download = false;
// if (!isAutoDownload() && confirm("Don't Download ?")) {
    // download = false;
// }

// setTimeout(() => {
    // if (!download) return;
    // downloadStart()
// }, 10000);

let id = setInterval(()=> {
  if (document.body.getAttribute('data-start') === 'start' || document.location.href.includes('download')) {
    downloadStart()
    clearInterval(id);
  }
}, 1000)