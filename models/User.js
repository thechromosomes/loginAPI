const mysql = require('mysql');
 
const pass = require('../config/keys');


// config to mysql
let db = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : pass.dbPass,
  database: 'logIn' 
});
 
//connection to my sql
db.connect(function(err) {
  if (!err) {
    console.log(`my sql connected locally`);
  }
  else
  console.log(`unable to connecte ${err}`)
});

module.exports = db;