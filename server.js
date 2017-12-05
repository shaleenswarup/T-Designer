//
// # SimpleServer
//
// A simple chat server using Socket.IO, Express, and Async.
// //
// var http = require('http');
// var path = require('path');

// var async = require('async');
// var socketio = require('socket.io');
var express = require('express');
var bodyParser=require("body-parser");
var mysql = require('mysql');

var router = express();
// router.use(bodyParser.json());
// router.use(bodyParser.urlencoded({extended:true}));
router.use(bodyParser.json({limit: '50mb'}));
router.use(bodyParser.urlencoded({limit: '50mb', extended: true}));
var con = mysql.createConnection({
  host: "localhost",
  user: "shaleenswarup",
  database: "CustomerDesigns"
});


con.connect();
// function(err) {
//   if (err) throw err;
//   var sql = "DELETE FROM designs";
//   con.query(sql, function (err, result) {
//     if (err) throw err;
//     console.log("Number of records deleted: " + result.affectedRows);
//   });
// }


router.use(express.static(__dirname +"/public"));
router.set("view engine","ejs");

router.get("/",function(req,res){
   con.query("SELECT * FROM designs", function (err, result, fields) {
    if (err) throw err;
// console.log(result);

     res.render("main",{results:result});
  });
   
});

router.post('/', function(req,res){
   var cope = req.body;
   var query = con.query('insert into designs set ?', cope, function(err, result) {
      if (err) {
      console.error(err);
      return res.send(err);
     } else {
         console.log("Saved successfully");
         console.log(result.insertId);
        var data={
             
             inserteddata:cope,
             id:result.insertId
         }
        return res.send(data);
   
     

      }
// });
});
}
);
router.delete("/",function(req,res){
    var name=req.body.name;
    console.log(name);
    var sql;
    if(typeof name=='number')
    {
        sql="DELETE FROM designs WHERE id = ?"
    }
    else{
        
        sql = "DELETE FROM designs WHERE name = ?"; 
    }
       
  con.query(sql,name, function (err, result) {
    if (err) throw err;
    
    console.log("Number of records deleted: " + result.affectedRows);
    console.log(result);
     return res.send(name);
    
  });
    });

// io.on('connection', function (socket) {
//     messages.forEach(function (data) {
//       socket.emit('message', data);
//     });

//     sockets.push(socket);

//     socket.on('disconnect', function () {
//       sockets.splice(sockets.indexOf(socket), 1);
//       updateRoster();
//     });

//     socket.on('message', function (msg) {
//       var text = String(msg || '');

//       if (!text)
//         return;

//       socket.get('name', function (err, name) {
//         var data = {
//           name: name,
//           text: text
//         };

//         broadcast('message', data);
//         messages.push(data);
//       });
//     });

//     socket.on('identify', function (name) {
//       socket.set('name', String(name || 'Anonymous'), function (err) {
//         updateRoster();
//       });
//     });
//   });

// function updateRoster() {
//   async.map(
//     sockets,
//     function (socket, callback) {
//       socket.get('name', callback);
//     },
//     function (err, names) {
//       broadcast('roster', names);
//     }
//   );
// }

// function broadcast(event, data) {
//   sockets.forEach(function (socket) {
//     socket.emit(event, data);
//   });
// }

// server.listen(process.env.PORT || 3000, process.env.IP || "0.0.0.0", function(){
//   var addr = server.address();
//   console.log("Chat server listening at", addr.address + ":" + addr.port);
// });

router.listen(process.env.PORT,process.env.IP,function(){
    
    console.log("Tee_Designer server has started");
    
});