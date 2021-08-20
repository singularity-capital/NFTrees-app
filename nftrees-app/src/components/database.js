var mysql = require('mysql');

var connection = mysql.createConnection({
  host: "nftrees.chusaaeupbmn.us-east-2.rds.amazonaws.com",
  user: "admin",
  password: "adminadmin",
  database: "testdb"
});

connection.connect(function(err) {
    if (err) throw err;
    console.log('Database is connected successfully');
});

module.exports = connection;