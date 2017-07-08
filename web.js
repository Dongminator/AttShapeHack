var express = require('express');
var mysql = require('mysql');
var fs = require('fs');
var app = express();

var bodyParser = require('body-parser')

app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
})); 
app.use( bodyParser.json() );       // to support JSON-encoded bodies

//app.use(express.json());       // to support JSON-encoded bodies
//app.use(express.urlencoded()); // to support URL-encoded bodies

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
	console.log('1');
	var connection = mysql.createConnection({     
	  host     : 'localhost',       
	  user     : 'root',               
	  password : 'root',        
	  port: '8889',
	  database: 'att',
	}); 
	console.log('2');
	connection.connect(function(err){
	    if(err){        
	        console.log('[query] - :'+err);
	        var data = [];
	        response.send(data);
	        return;
	    }
	    console.log('[connection connect]  succeed!');
	});  

	connection.query('SELECT id, name, points FROM travel WHERE id = ' + lineId, function(err, rows, fields) { 
	    if (err) {
	        console.log('[query] - :'+err);
	        var data = [];
	        response.send(data);
	        return;
	    }
	    console.log('The id is: ', rows[0].id);  

	    var data = JSON.stringify({ 
		    id: rows[0].id, 
		    name: rows[0].name, 
		    points: rows[0].points
		});

	    response.send(data);
	});  

	connection.end(function(err){
	    if(err){        
	        return;
	    }
	      console.log('[connection end] succeed!');
	});
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
