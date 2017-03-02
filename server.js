var express 	 = require('express'),
	app          = module.exports = express(),
	Config       = require('./config'),
	conf         = new Config(),
	bodyParser   = require('body-parser');

if(conf.error){
	console.log("Please define environment with NODE_ENV=dev/prod node server.js");
	return;
}

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.json());

app.use('/public/', express.static(__dirname + '/public', {maxAge : conf.maxAge}));

app.post('/msgcon', function(req, res){
	console.log("===Client MSG===", req.body.msgcon);

    res.setHeader("Content-Type", "text/json");
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.end("");
});

app.get('/', function(req, res){
  	res.render('webvrstarter_index.ejs', {mainFile : "/public/main" + conf.mainFile});
});

app.listen(conf.port);
console.log('Listening on port ' + conf.port);