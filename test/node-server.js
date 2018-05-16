/*
* original code from
* https://developer.mozilla.org/en-US/docs/Learn/Server-side/Node_server_without_framework
*/

var http = require('http');
var fs = require('fs');
var path = require('path');
var port = process.argv[2];
var mimeTypes = {
    '.html': 'text/html',
    '.js': 'text/javascript'
};

if (!port) return console.log('Using: node node-server.js [port]');

http.createServer(function (request, response) {
    var filePath = '.' + request.url;
    if (filePath == './') filePath = './index.html';

    var extname = String(path.extname(filePath)).toLowerCase();
    var contentType = mimeTypes[extname] || 'application/octet-stream';

    console.log('request ', request.url);
    fs.readFile(filePath, function (error, content) {
        response.writeHead(200, {
            'Content-Type': contentType
        });
        response.end(content, 'utf-8');
    });

}).listen(port);
console.log('Server running at http://127.0.0.1:' + port);