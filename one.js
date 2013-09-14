var https = require('https');

api_key = "034dfb38-c110-4545-8ef1-9453dc83d4a9"

https.get("https://192.168.151.182:8000/api3/?session=" +
	api_key + "&command=getparty", function(res) {
  console.log("Got response: " + res.statusCode);
}).on('error', function(e) {
  console.log("Got error: " + e.message);
});