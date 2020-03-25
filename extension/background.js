function sendRequest(type, url, data) {
    var postData = typeof data === "object" ? data : {};
    return new Promise(function (resolve, reject) {
        var http = new XMLHttpRequest();
        http.open(type, url, true);
        http.setRequestHeader("Content-type", "application/json");
        http.onreadystatechange = function () {
            if (http.readyState == 4) {
                if (http.status == 200) {
                    var contentType = http.getResponseHeader("Content-Type");
                    if (contentType.indexOf("json") >= 0) {
                        resolve({
                            success: true,
                            data: JSON.parse(http.responseText)
                        });
                    } else {
                        resolve({
                            success: true,
                            data: http.responseText
                        });
                    }
                } else {
                    reject({
                        success: false
                    })
                }
            }
        }
        http.onerror = function (e) {
            console.log('Failed to check existence');
            reject(e);
        };

        http.send(typeof (data) === "object" ? JSON.stringify(data) : data);
    });
}

chrome.runtime.onMessage.addListener(function (request, sender, response) {
    if (request.action == "request") {
        sendRequest(request.type, request.url, request.data).then((data) => {
            response({
                success: true,
                data: data
            });
        }).catch((err) => {
            response({
                success: false,
                message: err
            });
        });
    }

    return true;
});