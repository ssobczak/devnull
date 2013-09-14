var https = require('https');
var express = require('express');
var $ = require('jquery');
var Q = require('q');

var api_key = "034dfb38-c110-4545-8ef1-9453dc83d4a9"

function Requester() {
	self = {}

	function do_request(command, deferred) {
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
		        deferred.resolve(body.join(''))
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
		var deferred = Q.defer()

		if (now - last_req > 100 && queue_len == 0) {
			last_req = now
			do_request(command, deferred)
		} else {
			queue_len += 1
			setTimeout(function() {
				queue_len -= 1
				last_req = new Date()
				do_request(command, deferred)
			}, queue_len*100)
		}

		return deferred.promise
	} 

	return self;
}

var app = express();
app.configure(function(){
  app.use(express.static(__dirname + '/public'));
});

r = new Requester()
app.get('/players', function (req, res) {
  r.request("getparty")
  	.then(function(player_ids) {
    	player_ids = JSON.parse(player_ids)

    	funcs = $.map(player_ids.characters, function(char_id) {
			return r.request("getcharacter&arg=" + char_id)
		})

		Q.all(funcs).then(function(players) {
			players = $.map(players, JSON.parse)
	    	res.end(JSON.stringify(players));	
		})
    });
});

app.listen(8080);

r.request("getchartemplate")
	.then(function(template_str) {
		template = JSON.parse(template_str)
		template.name = "szymon"
		template.dex += 5
		template.con += 5

		return r.request("createcharacter&arg=name:" + template.name
			+ ",str:" + template.str
			+ ",dex:" + template.dex
			+ ",con:" + template.con
			+ ",int:" + template.int
			+ ",wis:" + template.wis)
	}).then(function(stored) {
		char = JSON.parse(stored)

		return r.request("deletecharacter&arg=" + char._id)
	}).then(function(res) {
		console.log('WIN!')
	})

