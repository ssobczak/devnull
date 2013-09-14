var https = require('https');

api_key = "034dfb38-c110-4545-8ef1-9453dc83d4a9"

var req = https.request({ 
      host: '192.168.151.182', 
      port: 8000,
      path: "/api3/?session=" + api_key + "&command=getparty",
      method: 'GET',
      rejectUnauthorized: false,
      requestCert: true,
      agent: false
    }, function(res) {

	var body = [];
    res.on('data', function(data){
        body.push(data);
    });

    res.on('end', function(){
        console.log( body.join('') );
    });
}).on('error', function(e) {
  console.log("Got error: " + e.message);
});

req.end()