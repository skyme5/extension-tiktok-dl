const DOWNLOAD_REQUEST_URL = "http://localhost/api/v2/downloader";
const SAVE_JSON_REQUEST_URL = "http://localhost:8000/json";
const REQUEST_URL = {
  cover: DOWNLOAD_REQUEST_URL,
  video: DOWNLOAD_REQUEST_URL,
  json: SAVE_JSON_REQUEST_URL
};

function padZero(number) {
  if (number < 10){
    return `0${number}`
  }

  return `${number}`
}

function getTimeDateString(timestamp) {
  // Convert UNIX Timestamp to Date
  var date = new Date(timestamp * 1000);

  return {
    year: date.getFullYear(),
    month: padZero(date.getMonth() + 1),
    day: padZero(date.getDate()),
    hour: padZero(date.getHours()),
    minute: padZero(date.getMinutes()),
    second: padZero(date.getSeconds()),
    str: [
      date.getFullYear(),
      padZero(date.getMonth() + 1),
      padZero(date.getDate()) + "_" + padZero(date.getHours()),
      padZero(date.getMinutes()),
      padZero(date.getSeconds())
    ].join("-")
  };
}

function collectMetaFromData(data) {
  var json = "JSON_URL";
  var video = data.itemInfos.video.urls[0];
  var cover = data.itemInfos.covers[0];
  var profilepic = data.authorInfos.coversLarger[0];

  var uniqueId = data.authorInfos.uniqueId;
  var userId = data.authorInfos.userId;
  var id = data.itemInfos.id;
  var createTime = JSON.parse(data.itemInfos.createTime); // convert to js timestamp
  var time = getTimeDateString(createTime);

  return {
    urls: {
      video,
      cover,
      json
    },
    metaData: {
      uniqueId,
      userId,
      createTime,
      id,
      time
    }
  };
}

function pathFormatter(m) {
  return {
    directory: `F:/TikTok/${m.userId}/${m.time.year}-${m.time.month}`,
    video: `${m.time.str} ${m.id}_${m.userId}.mp4`,
    cover: `${m.time.str} ${m.id}_${m.userId}.jpg`,
    json: `${m.time.str} ${m.id}_${m.userId}.json`
  };
}

function getMediaForDownload(data) {
  var metaData = collectMetaFromData(data);
  var filepath = pathFormatter(metaData.metaData);
  var list = [];
  "video cover json".split(" ").forEach((media) => {
    list.push({
      requestUrl: REQUEST_URL[media],
      requestData: {
        url: metaData.urls[media],
        filename: filepath[media],
        directory: filepath.directory,
        metadata: {
          location: 'tiktok.com',
          title: 'tiktok',
          json: media == 'json' ? data : {}
        }
      }
    });
  });

  return list;
}