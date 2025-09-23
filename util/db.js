const mysql = require("mysql2");

// The key part in this object must be written like this you can't get
// creative with names like writing "db" it has to be "database" and so on

const pool = mysql.createPool({
  host: "localhost",
  user: "root",
  database: "node-complete",
  password: "12345",
});

module.exports = pool.promise();
