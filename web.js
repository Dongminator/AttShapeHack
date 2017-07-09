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

	var connection = mysql.createConnection({     
	  host     : 'localhost',       
	  user     : 'root',               
	  password : 'root',        
	  port: '8889',
	  database: 'att',
	}); 

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

	    if(rows.length == 0){
	    	var data = [];
	        response.send(data);
	        return;
	    }else{
		    console.log('The id is: ', rows[0].id);  
		    var data = JSON.stringify({ 
			    id: rows[0].id, 
			    name: rows[0].name, 
			    points: rows[0].points
			});
		    response.send(data);
		}
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
    
    var connection = mysql.createConnection({     
	  host     : 'localhost',       
	  user     : 'root',               
	  password : 'root',        
	  port: '8889',
	  database: 'att',
	}); 

	connection.connect(function(err){
	    if(err){        
	        console.log('[query] - :'+err);
	        var data = [];
	        response.send(data);
	        return;
	    }
	    console.log('[connection connect]  succeed!');
	});  

	if(id == -1){
		var  userAddSql = 'INSERT INTO travel(name, points) VALUES(?,?)';
		var  userAddSql_Params = [name, points];
		
		connection.query(userAddSql,userAddSql_Params,function (err, result) {
		        if(err){
		         console.log('[INSERT ERROR] - ',err.message);
		         var data = [];
	        	response.send(data);
		         return;
		        }        

		       console.log('--------------------------INSERT----------------------------');     
		       console.log('INSERT ID:',result.insertId);        
		       console.log('-----------------------------------------------------------------\n\n');  
    			
    			res.send("id: " + result.insertId);
		});
	}else{
		var  userAddSql = 'UPDATE travel SET name = ?, points = ? WHERE id = ?';
		var  userAddSql_Params = [name, points, id];
		
		connection.query(userAddSql,userAddSql_Params,function (err, result) {
		        if(err){
		         console.log('[UPDATE ERROR] - ',err.message);
		         var data = [];
	        	 response.send(data);
		         return;
		        }        

		       console.log('--------------------------UPDATE----------------------------');     
		       console.log('UPDATE ID:',result);        
		       console.log('-----------------------------------------------------------------\n\n');  
		});
    	res.send("id: " + id);
	}

	connection.end(function(err){
	    if(err){        
	        return;
	    }
	    console.log('[connection end] succeed!');
	});
});

var port = process.env.PORT || 3000;
app.listen(port);
