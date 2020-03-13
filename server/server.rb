# frozen_string_literal: true

require 'fileutils'
require 'json'
require 'webrick'

CWD = 'F:/TikTok'

Dir.chdir(CWD)

root = File.expand_path CWD
server = WEBrick::HTTPServer.new(Port: 8000, DocumentRoot: root)

server.mount_proc '/json' do |req, res|
  data = JSON.parse(req.body)

  FileUtils.mkdir_p(data["directory"]) unless Dir.exist?(data["directory"])

  json_file = File.open(File.join(data["directory"], data["filename"]), 'w')
  json_file.print data["metadata"]["json"]
  json_file.close

  res['Content-Type'] = 'application/json'
  res.body = '{success: true}'
end

trap 'INT' do
  server.shutdown
end

server.start
