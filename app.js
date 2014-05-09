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
		console.log(req.body);

		arr.unshift(req.body);
		

		fs.writeFile('todolist.json',JSON.stringify(arr),function(err, data){
		  if (err) throw err;
		})
		res.send(1);

	})

	
	
});

//update the done
app.put('/items/:id',function(req,res){
	fs.readFile('todolist.json',function(err, data){
		console.log(req.params.id);
		var arr = JSON.parse(data);
		console.log("改done前："+JSON.stringify(arr));

		arr[req.params.id].done = true;

		console.log("改done後："+JSON.stringify(arr));

		fs.writeFile('todolist.json',JSON.stringify(arr),function(err, data){
			if (err) throw err;
		});

	})

});

//change the position
app.put('/items/:id/reposition/:new_position',function(req,res){
	fs.readFile('todolist.json',function(err,data){


		console.log("id: "+req.params.id+" repo: "+req.params.new_position);
		var arr = JSON.parse(data);
		
		//remove
		var mvitem = arr.splice(req.params.id,1);
		console.log(JSON.stringify(arr));

		console.log(mvitem[0]);	

		//add
		arr.splice(req.params.new_position,0,mvitem[0]);
		console.log(JSON.stringify(arr));

		fs.writeFile('todolist.json',JSON.stringify(arr),function(err, data){
			if (err) throw err;
		});

		res.send(arr);	
	})

	
});


//delete item
app.delete('/items/:id',function(req,res){
	fs.readFile('todolist.json',function(err, data){
		console.log(req.params.id);
		var arr = JSON.parse(data);
		arr.splice(req.params.id,1);
		console.log("delete: "+JSON.stringify(arr));

		fs.writeFile('todolist.json',JSON.stringify(arr),function(err, data){
			if (err) throw err;
		});

	})

})


app.listen(5000);




