const DOWNLOAD_REQUEST_URL = "http://localhost/api/v2/downloader";
const SAVE_JSON_REQUEST_URL = "http://localhost:3234/json";
const REQUEST_URL = {
  cover: DOWNLOAD_REQUEST_URL,
  video: DOWNLOAD_REQUEST_URL,
  json: SAVE_JSON_REQUEST_URL
};

function getTimeDateString(timestamp) {
  // Convert UNIX Timestamp to UTC Date
  var utc = new Date(timestamp * 1000).toISOString();
  var date = utc.split(".")[0];

  var parts = date.split(/[\-:\T]/g)

  return {
    year: parts[0],
    month: parts[1],
    day: parts[2],
    hour: parts[3],
    minute: parts[4],
    second: parts[5],
    str: [
      parts[0],
      parts[1],
      parts[2] + "_" + parts[3],
      parts[4],
      parts[5]
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
    directory: `${MEDIA_SAVE_PREFIX}/${m.userId}/${m.time.year}-${m.time.month}`,
    video: `${m.time.str} ${m.id}_${m.userId}.mp4`,
    cover: `${m.time.str} ${m.id}_${m.userId}.jpg`,
    json: `${m.time.str} ${m.id}_${m.userId}.json`
  };
}

function getMediaForDownload(data) {
  var metaData = collectMetaFromData(data);
  var filepath = pathFormatter(metaData.metaData);
  var list = [];
  "video json".split(" ").forEach((media) => {
    list.push({
      requestUrl: REQUEST_URL[media],
      requestData: {
        url: metaData.urls[media],
        filename: filepath[media],
        directory: filepath.directory,
        data: JSON.stringify(data),
        metadata: {
          location: 'tiktok.com',
          title: 'tiktok',
          json: {}
        }
      }
    });
  });

  return list;
}