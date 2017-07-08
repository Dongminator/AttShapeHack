var express = require('express');
var fs = require('fs');
var app = express();

var bodyParser = require('body-parser')

app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
})); 
app.use( bodyParser.json() );       // to support JSON-encoded bodies


app.use('/scripts', express.static('scripts'));


app.get('/', function(req, res){
	fs.readFile('index.html', function(err, file) {
		res.setHeader('Content-Type', 'text/html');
		res.setHeader('Content-Length', file.length);
		res.end(file);
	});
});

app.get('/line/:arg1', function(request, response) {
	var lineId = request.params.arg1;
	
	// get line data from database.
	
	// ...
	
	var data = "test test test: line Id is: " + lineId;
	response.send(data);
});


app.post('/line/save', function(req, res) {
    var id = req.body.id;
    var name = req.body.name;
    var points = req.body.points;
    console.log(id);
    console.log(name);
    console.log(points);
    
    // ...
    
    res.send(id + " : " + name + " : " + points);
});

var port = process.env.PORT || 3000;
app.listen(port);
