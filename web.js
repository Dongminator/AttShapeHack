var express = require('express');
var fs = require('fs');
var app = express();



app.use('/scripts', express.static('scripts'));


app.get('/', function(req, res){
	fs.readFile('index.html', function(err, file) {
		res.setHeader('Content-Type', 'text/html');
		res.setHeader('Content-Length', file.length);
		res.end(file);
	});
});


var port = process.env.PORT || 3000;
app.listen(port);
