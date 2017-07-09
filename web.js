var express = require('express');
var mysql = require('mysql');
var fs = require('fs');
var app = express();
var pg = require('pg');
var url = require('url')
var bodyParser = require('body-parser')

const postgres_connection_string = process.env.DATABASE_URL || "postgres://xdpngdomkvcfzw:784df11e58a29b09a56934adcfb06b844826201836bab0a446f48cd5b78ee3c9@ec2-54-243-252-91.compute-1.amazonaws.com:5432/da3shana9mdpvp";
const params = url.parse(postgres_connection_string);
const auth = params.auth.split(':');
const config = {
	user : auth[0],
	password : auth[1],
	host : params.hostname,
	port : params.port,
	database : params.pathname.split('/')[1],
	ssl : true
};

var pool = new pg.Pool(config); // new version

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

	const results = [];
	
    // Get a Postgres client from the connection pool
    pool.query('SELECT id, name, points FROM travel WHERE id = ' + lineId, function(err, result){
    	response.json(result);
    });
});


app.post('/line/save', function(req, res) {
    var id = req.body.id;
    var name = req.body.name;
    var points = req.body.points;
    
    const results = [];
	console.log(1);
	
	
	if(id == -1){
        console.log("inserting new travel info...");
        
        pool.query('INSERT INTO travel(name, points) values($1, $2) RETURNING id', [name, points], function(err, result) {
    		if(err) {
    			console.log(err);
    		}
    		console.log(result);
    		res.send(result);
    	});
	  } else {
        console.log("getting existing travel info...");
        pool.query('UPDATE travel SET name=($1), points=($2) WHERE id=($3)', [name, points, id], function(err, result) {
    		if(err) {
    			console.log(err);
    		}
    		console.log('--------------------------UPDATE----------------------------');     
    		console.log('UPDATE ID:',id);        
    		console.log('-----------------------------------------------------------------\n\n');  
    		res.send("id: " + id);
    		
    		console.log(result);
    	});
	  }
});

var port = process.env.PORT || 3000;
app.listen(port);
