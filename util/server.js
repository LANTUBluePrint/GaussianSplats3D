import * as http from 'http';
import * as fs from 'fs';
import * as path from 'path';

let baseDirectory = '.';
let port = 80;
let host = '0.0.0.0';
let lasttRequesTime = performance.now() / 1000;
for(let i = 0; i < process.argv.length; ++i) {
  if (process.argv[i] == '-d' && i < process.argv.length - 1) {
    baseDirectory = process.argv[i + 1];
  }
  if (process.argv[i] == '-p' && i < process.argv.length - 1) {
    port = process.argv[i + 1];
  }
  if (process.argv[i] == '-h' && i < process.argv.length - 1) {
    host = process.argv[i + 1];
  }
}

http
  .createServer(function (request, response) {

    // 添加CORS头
    response.setHeader("Access-Control-Allow-Origin", "*"); // 允许所有域
    response.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS"); // 允许的HTTP方法
    response.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept"); // 允许的HTTP头

    let filePath = baseDirectory + request.url;
    if (filePath == "./") filePath = "./index.html";

    const extname = path.extname(filePath);
    let contentType = "text/html";
    switch (extname) {
      case ".js":
        contentType = "text/javascript";
        break;
      case ".css":
        contentType = "text/css";
        break;
      case ".json":
        contentType = "application/json";
        break;
      case ".png":
        contentType = "image/png";
        break;
      case ".jpg":
        contentType = "image/jpg";
        break;
    }

    const requestTime = performance.now() / 1000;
    if (requestTime - lasttRequesTime > 1) {
      console.log("");
      console.log("-----------------------------------------------");
    }

    fs.readFile(filePath, function (error, content) {
      if (error) {
        if (error.code == "ENOENT") {
          console.log("HTTP(404) Request for " + filePath + " -> File not found.");
        } else {
          console.log("HTTP(500)) Request for " + filePath + " -> Server error.");
          response.writeHead(500);
          response.end(
            "Sorry, check with the site admin for error: " +
              error.code +
              " ..\n"
          );
          response.end();
        }
      } else {
        console.log("HTTP(200) Request for " + filePath);
        response.writeHead(200, { "Content-Type": contentType });
        response.end(content, "utf-8");
      }
    });

    lasttRequesTime = requestTime;
  })
  .listen(port, host);
console.log("Server running at " + host + ':' + port);
