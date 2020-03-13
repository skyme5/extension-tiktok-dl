const INPUT_CLASSNAME = "tiktok-response";
const INPUT_SELECT_QUERY = "input.tiktok-response";
const INTERCEPT_RESPONSE_URL_TYPE = "TIKTOK_AWEME_LIST";
const INTERCEPT_USERINFO_URL_TYPE = "TIKTOK_USER_INFO";

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

function processInputResponse(input) {
  input.classList.remove(INPUT_CLASSNAME);

  var type = input.getAttribute("data-type");
  var data = JSON.parse(input.value);

  if (type == INTERCEPT_RESPONSE_URL_TYPE) {
    getItemListData(data).forEach(aweme => {
      getMediaForDownload(aweme).forEach((item) => {
        makeRequest(item);
      });
    });
  } else if (type == INTERCEPT_USERINFO_URL_TYPE) {
    makeRequest({
      requestUrl: SAVE_JSON_REQUEST_URL,
      requestData: {
        url: "SAVE_USER_JSON_REQUEST",
        filename: `${data.userInfo.user.id}.json`,
        directory: `F:/TikTok/${data.userInfo.user.id}`,
        metadata: {
          json: data
        }
      }
    });

    makeRequest({
      requestUrl: REQUEST_URL.cover,
      requestData: {
        url: data.userInfo.user.avatarLarger,
        filename: data.userInfo.user.avatarLarger.split("/").pop(),
        directory: `F:/TikTok/${data.userInfo.user.id}`,
        metadata: {
          location: 'tiktok.com',
          title: 'tiktok',
          json: {}
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


var download = true;
if (confirm("Don't Download ?")) {
  download = false;
}

setTimeout(() => {
  if (!download) return;

  setInterval(() => {
    processInput();
    window.scrollTo(0, document.querySelector(".video-feed").scrollHeight);
  }, 1500);
}, 10000);