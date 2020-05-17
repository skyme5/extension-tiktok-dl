const INTERCEPT_RESPONSE_URL = "https://www.tiktok.com/share/item/list";
const INTERCEPT_RESPONSE_URL_TYPE = "TIKTOK_AWEME_LIST";
const INTERCEPT_USERINFO_URL = "https://t.tiktok.com/api/user/detail";
const INTERCEPT_USERINFO_URL_TYPE = "TIKTOK_USER_INFO";

var XHR = XMLHttpRequest.prototype;
var send = XHR.send;
var open = XHR.open;
XHR.open = function (method, url) {
  this.url = url;
  return open.apply(this, arguments);
};
XHR.send = function () {
  this.addEventListener("load", function (e) {
    if (this.url.includes(INTERCEPT_RESPONSE_URL)) {
      appendToDOM(e.target.responseText, INTERCEPT_RESPONSE_URL_TYPE);
      // userDetailsRequest(this.url.split('_signature=').pop(), __NEXT_DATA__.query.uniqueId);

      var data = {
        body: {
          hasMore: true,
          itemABParams: [],
          itemListData: [],
          maxCursor: "1576854650000",
          minCursor: "1586923609000",
          pageState: {}
        },
        errMsg: null,
        statusCode: 0
      }
    }

    if (this.url.includes(INTERCEPT_USERINFO_URL)) {
      appendToDOM(e.target.responseText, INTERCEPT_USERINFO_URL_TYPE);

      var data = JSON.parse(e.target.responseText);
      var id = data.userInfo.user.id;
      var username = data.userInfo.user.uniqueId;
      var fullname = data.userInfo.user.nickname;
      document.body.setAttribute("data-id", id);
      addHelperText(id, username, fullname);
    }
  });
  return send.apply(this, arguments);
};

function addHelperText(id, username, fullname) {
  if (document.querySelector(".share-id") === null) {
    var div = document.createElement("DIV");
    div.className = "share-id";
    div.textContent = `tikadd "${id}" "${username}" "${fullname}"`;
    document.querySelector(".share-info").appendChild(div);
  }
}

function appendToDOM(data, type) {
  var input = document.createElement("input");
  input.className = "tiktok-response";
  input.style.display = "none";
  input.setAttribute("data-type", type);
  input.value = data;

  document.body.appendChild(input);
}

function userDetailsRequest(_signature, uniqueId) {
  var xhr = new XMLHttpRequest();
  xhr.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {}
  };
  xhr.open("GET", `https://t.tiktok.com/api/user/detail/?uniqueId=${uniqueId}&language=en&verifyFp=&_signature=${_signature}`, true);
  xhr.send();
}