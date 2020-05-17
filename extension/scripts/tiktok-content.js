const INPUT_CLASSNAME = "tiktok-response";
const INPUT_SELECT_QUERY = "input.tiktok-response";
const INTERCEPT_RESPONSE_URL_TYPE = "TIKTOK_AWEME_LIST";
const INTERCEPT_USERINFO_URL_TYPE = "TIKTOK_USER_INFO";
const REQUEST_MEDIA_DOWNLOAD_URL = "http://localhost:3234/exist";
const MEDIA_SAVE_PREFIX = "F:/TikTok";
var HAS_MORE = true;

function getItemListData(data) {
  return data.body.itemListData;
}

function getUserInfoData(data) {
  return data.userInfo;
}

function makeRequest(data) {
  chrome.runtime.sendMessage({
      action: "request",
      url: data.requestUrl,
      type: "POST",
      data: data.requestData
    },
    function (response) {}
  );
}

function makeMediaRequest(data) {
  chrome.runtime.sendMessage({
      action: "request",
      url: REQUEST_MEDIA_DOWNLOAD_URL,
      type: "POST",
      data: {
        path: `${data.requestData.directory}/${data.requestData.filename}`
      }
    },
    function (response) {
      if (!response.success) {
        chrome.runtime.sendMessage({
            action: "request",
            url: data.requestUrl,
            type: "POST",
            data: data.requestData
          },
          function (response) {}
        );
      }
    }
  );
}

function processInputResponse(input) {
  input.classList.remove(INPUT_CLASSNAME);

  var type = input.getAttribute("data-type");
  var data = JSON.parse(input.value);

  if (type == INTERCEPT_RESPONSE_URL_TYPE) {
    HAS_MORE = data.body.hasMore;
    // Download User AWEMEs
    getItemListData(data).forEach(aweme => {
      getMediaForDownload(aweme).forEach((item) => {
        if (item.requestUrl == SAVE_JSON_REQUEST_URL)
          makeRequest(item);
        else
          makeMediaRequest(item);
      });
    });
  } else if (type == INTERCEPT_USERINFO_URL_TYPE) {
    // Download User JSON
    makeRequest({
      requestUrl: SAVE_JSON_REQUEST_URL,
      requestData: {
        url: "SAVE_USER_JSON_REQUEST",
        filename: `${data.userInfo.user.id}.json`,
        directory: `${MEDIA_SAVE_PREFIX}/${data.userInfo.user.id}`,
        data: JSON.stringify(data)
      }
    });

    // Download Profile Picture
	var filename = data.userInfo.user.avatarLarger.split("/").pop();
	if (filename.indexOf('.jpg') < 0)
		filename += '.jpg';
    makeMediaRequest({
      requestUrl: REQUEST_URL.cover,
      requestData: {
        url: data.userInfo.user.avatarLarger,
        filename: filename,
        directory: `${MEDIA_SAVE_PREFIX}/${data.userInfo.user.id}`,
        metadata: {
          location: 'tiktok.com',
          title: 'tiktok'
        }
      }
    });
  }
}

function processInput() {
  document.querySelectorAll(INPUT_SELECT_QUERY).forEach(input => {
    processInputResponse(input);
  });
}

function isAutoDownload() {
  return window.location.href.includes("autoDownload=true");
}

var download = true;
if (!isAutoDownload() && confirm("Don't Download ?")) {
  download = false;
}

setTimeout(() => {
  if (!download) return;

  setInterval(() => {
    processInput();
    var feed = document.querySelector(".video-feed");
    if (HAS_MORE && feed !== null)
      window.scrollTo(0, feed.scrollHeight);
  }, 1500);
}, 10000);