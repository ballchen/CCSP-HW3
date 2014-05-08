var express = require('express');
var app = express();
var fs = require('fs');
var http = require('http');

app.use(express.static(__dirname + '/public'));
app.use(express.bodyParser());



//load page
app.get('/',function(req,res){
	res.sendfile( __dirname +'/index.html');
});

//load list
app.get('/items',function(req,res){
	fs.readFile('todolist.json',function(err,data){
		res.send(data);
	})
});

//add list
app.post('/items',function(req,res){
	fs.readFile('todolist.json',function(err,data){
		var arr = JSON.parse(data);
		console.log(arr);
		arr.push(req.body);
		console.log(arr);
		fs.writeFile('todolist.json',JSON.stringify(arr),function(err, data){
		  if (err) throw err;
		})

	})

	
	
});

//delete item
app.delete('/items/:id',function(req,res){
	fs.readFile('todolist.json',function(err, data){
		console.log(req.params.id);
		var arr = JSON.parse(data);
		delete arr[req.params.id];
		console.log(JSON.stringify(arr));

		fs.writeFile('todolist.json',JSON.stringify(arr),function(err, data){
			if (err) throw err;
		});

	})

})


app.listen(5000);




