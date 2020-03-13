function sendRequest(type, url, data) {
  var postData = typeof data === "object" ? data : {};
  return new Promise(function (resolve, reject) {
      var http = new XMLHttpRequest();
      http.open(type, url, true);
      http.setRequestHeader("Content-type", "application/json");
      http.onreadystatechange = function () {
          if (http.readyState == 4 && http.status == 200) {
              var contentType = http.getResponseHeader("Content-Type");
              if (contentType.indexOf("json") >= 0) {
                  resolve(JSON.parse(http.responseText));
              } else {
                  resolve(http.responseText);
              }
          }
      }
      http.onerror = function (e) {
          console.log('Failed to check existence');
          reject(e);
      };

      http.send(data != null ? JSON.stringify(data) : null);
  });
}

chrome.runtime.onMessage.addListener(function (request, sender, response) {
  if (request.action == "request") {
      sendRequest(request.type, request.url, request.data).then((data) => {
          response(data);
      }).catch((err) => {
          response({ success: false, message: err });
      });
  }

  return true;
});
