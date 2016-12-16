var express 	 = require('express'),
	app          = module.exports = express(),
	Config       = require('./config'),
	conf         = new Config();

if(conf.error){
	console.log("Please define environment with NODE_ENV=dev/prod node server.js");
	return;
}

app.use('/public/', express.static(__dirname + '/public', {maxAge : conf.maxAge}));

app.get('/', function(req, res){
  	res.render('webvrstarter_index.ejs', {mainFile : "/public/main" + conf.mainFile});
});

app.listen(conf.port);
console.log('Listening on port ' + conf.port);