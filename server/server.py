#!/usr/bin/env python

import json
import os
import signal
import sys
import time
from queue import Queue
from threading import Thread, currentThread
from time import sleep

from loguru import logger
from sanic import Sanic, response
from tiktok_dl import TikTok

app = Sanic(name="TikTok Downloader Backend")
t = TikTok(
    output_template="D:/TikTok/{user_id}/{Y}-{m}/{id}_{user_id}",
    download_archive="C:/msys64/home/sky/tiktok.archive.txt",
    daemon=True
)

with open('C:/msys64/home/sky/tiktok.cache.txt', 'r') as f:
    for i in f.read().split("\n"):
        t.enqueue(i)

t.run()


@app.route("/url", methods=["POST"])
async def save_json(request):
    data = request.json
    logger.info("Download Request {}", data["url"])
    t.enqueue(data["url"])

    return response.json({"received": True})


if __name__ == "__main__":
    try:
        app.run(host="0.0.0.0", port=3234)
        print('running server')
    except KeyboardInterrupt:
        sys.exit(0)
