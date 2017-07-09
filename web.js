var express = require('express');
var mysql = require('mysql');
var fs = require('fs');
var app = express();
var pg = require('pg');
var url = require('url')

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

var pool = new pg.Pool(config);

pool.query('SELECT * from travel', function(err, result) {
	if(err) {
		console.log(err);
	}
	console.log(result);
});
//pg.connect(postgres_connection_string, function(err, client) {
//  if (err) {
//	  console.log(err);
//  }
//  
//  console.log('Connected to postgres! Getting schemas...');
//
//  client
//    .query('SELECT table_schema,table_name FROM information_schema.tables;')
//    .on('row', function(row) {
//      console.log(JSON.stringify(row));
//    });
//});

var config = {
  user: 'xdpngdomkvcfzw', //env var: PGUSER
  database: 'da3shana9mdpvp', //env var: PGDATABASE
  password: '784df11e58a29b09a56934adcfb06b844826201836bab0a446f48cd5b78ee3c9', //env var: PGPASSWORD
  host: 'ec2-54-243-252-91.compute-1.amazonaws.com', // Server hosting the postgres database
  port: 5432, //env var: PGPORT
  max: 10, // max number of clients in the pool
  idleTimeoutMillis: 30000, // how long a client is allowed to remain idle before being closed
  ssl: true
};
var Pool = require('pg').Pool;

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

	const results = [];
	var pool = new Pool(config);
    // Get a Postgres client from the connection pool
    pool.connect(function(err, client, done){
      // Handle connection errors
      if(err) {
        done();
        console.log(err);
        return res.status(500).json({success: false, data: err});
      }
      // SQL Query > Select Data
      const query = client.query('SELECT id, name, points FROM travel WHERE id = ' + lineId);
      // Stream results back one row at a time
      query.on('row', (row) => {
        results.push(row);
      });
      // After all data is returned, close connection and return results
      query.on('end', () => {
        done();
        return response.json(results);
      });
    });
});


app.post('/line/save', function(req, res) {
    var id = req.body.id;
    var name = req.body.name;
    var points = req.body.points;
    console.log(id);
    console.log(name);
    console.log(points);
    
    const results = [];
	console.log(1);
	var pool = new Pool(config);
	console.log(2);
    // Get a Postgres client from the connection pool
    pool.connect(function(err, client, done){
      // Handle connection errors
      if(err) {
        done();
        console.log(err);
        return res.status(500).json({success: false, data: err});
      }
      if(id == -1){
        console.log(3);
	      client.query('INSERT INTO travel(name, points) values($1, $2)', [name, points]);
	    // SQL Query > Select Data
	    const query = client.query('SELECT top 1 * FROM travel ORDER BY id ASC');
	    // Stream results back one row at a time
	    query.on('row', (row) => {
	      results.push(row);
	      console.log(row);
	    });
	    // After all data is returned, close connection and return results
	    query.on('end', () => {
	      done();
	      return res.json(results);
	    });
	  }else{
        console.log(4);
	  	client.query('UPDATE travel SET name=($1), points=($2) WHERE id=($3)', [name, points, id]);
	  	console.log('--------------------------UPDATE----------------------------');     
		console.log('UPDATE ID:',id);        
		console.log('-----------------------------------------------------------------\n\n');  
		res.send("id: " + id);
	  }
    });
});

var port = process.env.PORT || 3000;
app.listen(port);
