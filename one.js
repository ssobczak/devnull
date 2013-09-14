var https = require('https');
var api_key = "034dfb38-c110-4545-8ef1-9453dc83d4a9"

function Requester() {
	self = {}

	function do_request(command, callback) {
		var req = https.request({ 
			host: '192.168.151.182', 
			port: 8000,
			path: "/api3/?session=" + api_key + "&command=" + command,
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
		        console.log( "Got response: " + body.join('') );
		        callback(body.join(''))
		    });
		}).on('error', function(e) {
		  console.log("Got error: " + e.message);
		});

		req.end()
	}

	last_req = 0
	queue_len = 0

	self.request = function(command, cb) {
		now = new Date()

		if (now - last_req > 1000 && queue_len == 0) {
			last_req = now
			do_request(command, cb)
		} else {
			queue_len += 1
			setTimeout(function() {
				queue_len -= 1
				last_req = new Date()
				do_request(command, cb)
			}, queue_len*1000)
		}
	} 

	return self;
}

r = new Requester()
r.request("getchartemplate", function(template_str) {
	template = JSON.parse(template_str)
	template.name = "szymon"
	template.dex += 5
	template.con += 5

	r.request("createcharacter&arg=name:" + template.name
		+ ",str:" + template.str
		+ ",dex:" + template.dex
		+ ",con:" + template.con
		+ ",int:" + template.int
		+ ",wis:" + template.wis, 
	function(stored) {
		char = JSON.parse(stored)

		r.request("getcharacter&arg=" + char._id, function(me) {
			r.request("deletecharacter&arg=" + char._id, function(res) {
				console.log('WIN!')
			})
		})
	})
})