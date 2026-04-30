const http = require('http');
http.createServer((req, res) => {
  res.end('Hello from Serverless CI/CD Pipeline');
}).listen(3000);
