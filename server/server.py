#!/usr/bin/env python

import os
import json

from sanic import Sanic
from sanic import response

app = Sanic(name="TikTok Downloader Backend")


@app.route('/exist', methods=['POST'])
async def file_exist(request):
    data = request.json
    if os.path.isfile(data['path']):
        return response.json(
            {},
            status=200
        )
    return response.json(
        {},
        status=404
    )


@app.route('/json', methods=['POST'])
async def save_json(request):
    data = request.json
    directory = data['directory']
    filename = data['filename']
    if not os.path.isdir(directory):
        os.makedirs(directory, exist_ok=True)

    filepath = os.path.join(directory, filename)
    if not os.path.isfile(filepath):
        with open(filepath, 'w') as f:
            json.dump(data['metadata']['json'], f)

    return response.json({"received": True})

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8000)
