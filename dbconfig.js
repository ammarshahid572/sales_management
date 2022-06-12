var mysql = require('mysql');
var conn = mysql.createConnection({
  host: 'localhost',  // Replace with your host name
  user: 'sunny',      // Replace with your database username
  password: 'sunny123',      // Replace with your database password
  database: 'sales_manage' // // Replace with your database Name
}); 
conn.connect(function(err) {
  if (err) throw err;
  console.log('Database is connected successfully !');
});
module.exports = conn;