const http = require("http");
var post_data = {
  posid: "12345678",
  operid: "12345678",
  transType: "00",
  transAmt: "000000000012",
  oldDate: "",
  oldReference: "",
  oldTrace: "",
  trk2: "",
  trk3: "",
  lrc: "001"
}; //这是需要提交的数据

// var content = qs.stringify(post_data);

var options = {
  hostname: "127.0.0.1",
  port: 80,
  method: "POST",
  headers: {
    "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8"
  }
};

var req = http.request(options, function(res) {
  console.log("STATUS: " + res.statusCode);
  console.log("HEADERS: " + JSON.stringify(res.headers));
  res.setEncoding("utf8");
  res.on("data", function(chunk) {
    console.log("BODY: " + chunk);
  });
});
