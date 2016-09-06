var express = require('express');
var app = express();
var server = require('http').createServer(app);
var config = {port: process.env.OPENSHIFT_NODEJS_PORT, ip: process.env.OPENSHIFT_NODEJS_IP};
//const pug = require('pug');
//const compiledFunction = pug.compileFile('index.pug');
var bodyParser = require('body-parser');
var compress = require('compression');
var sourceData;
var sourceTimestamp;

app.use(compress())
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.route('/stalker')
	.post(function (req, res) {
		var date = new Date();
		console.log(req.body, req.body.data);
		sourceData = req.body.data;
		sourceTimestamp = date.toUTCString();
		res.status(200).end();
	});

app.route('/')
	.get(function (req, res) {
		if (!sourceData) {
			res.send('<p>Still warming up, please wait...</p>');
		} else {
			res.send(generateHTML(sourceData, sourceTimestamp));
		}
	});

server.listen(config.port, config.ip, function () {

    console.log('Server hub launched at', config.ip, config.port);

});

function generateHTML (data, timestamp) {
	var list = '<div>Last updated: ' + timestamp +'</div><ul>';
	for (var i = data.length - 1; i >= 0; i--) {
		list += '<li>' + data[i].name + '</li>';
	}
	list += '</ul>';
	return list;
}