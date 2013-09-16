var https = require('https');
var express = require('express');
var $ = require('jquery');
var Q = require('q');

var api_key = "034dfb38-c110-4545-8ef1-9453dc83d4a9"

function Requester() {
	self = {}

	function do_request(command, deferred) {
		path = "/api3/?session=" + api_key + "&command=" + command
		console.log("Requesting " + path)

		var req = https.request({ 
			host: '192.168.151.182', 
			port: 8000,
			path: path,
			method: 'GET',
			rejectUnauthorized: false,
			requestCert: true,
			agent: false
	    }, function(res) {
			var body = "";
		    res.on('data', function(data){
		        body += data;
		    });

		    res.on('end', function(){
		        console.log( "Got response: " + body);
		        deferred.resolve(body)
		    });
		}).on('error', function(e) {
		  console.log("Got error: " + e.message);
		})

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
  app.use(express.bodyParser());
});

r = new Requester()

app.get('/players/list', function (req, res) {
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

app.get('/players/new', function (req, res) {
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
		res.end(stored)
	})
});

app.post('/players/delete', function (req, res) {
	player = req.body

	r.request("deletecharacter&arg=" + player.id)
		.then(function(ignore) {
			res.end('OK')
		})
});

app.post('/players/save', function (req, res) {
	player = req.body
	console.log("playa: " + JSON.stringify(player))

	r.request("deletecharacter&arg=" + player.id)
		.then(function() {
			console.log("a")
			return r.request("createcharacter&arg="
					+ "name:" + player.name
					+ ",str:" + player.str
					+ ",dex:" + player.dex
					+ ",con:" + player.con
					+ ",int:" + player.int
					+ ",wis:" + player.wis
			)
		}).then(function() {
			res.end('OK')
		})
});

app.post('/map', function (req, res) {
	id = req.body.playerId

	r.request("scan&arg=" + id)
		.then(function(map) {
			res.end(map)
		})
});

app.listen(8080);
