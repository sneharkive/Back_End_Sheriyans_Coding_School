const http = require ('http');

const sever = http.createServer((req, res) => {
  res.end("Hello World")
})

sever.listen(3000);