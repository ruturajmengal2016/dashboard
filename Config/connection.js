const mysql = require("mysql2");

const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "Ruturaj@1234",
  database: "data",
});

module.exports = connection;
