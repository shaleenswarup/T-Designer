
var express = require('express');
var bodyParser=require("body-parser");
var mysql = require('mysql');

var router = express();

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
//   console.log("Connected!");
//   var sql = "CREATE TABLE design (id INT AUTO_INCREMENT PRIMARY KEY, name VARCHAR(255), designdata LONGTEXT)";
//   con.query(sql, function (err, result) {
//     if (err) throw err;
//     console.log("Table created");
//   });
// }
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
//console.log(result);

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
    console.log(name);
     return res.send("Deleted");
    
  });
    });


// server.listen(process.env.PORT || 3000, process.env.IP || "0.0.0.0", function(){
//   var addr = server.address();
//   console.log("Chat server listening at", addr.address + ":" + addr.port);
// });

router.listen(process.env.PORT,process.env.IP,function(){
    
    console.log("Tee_Designer server has started");
    
});