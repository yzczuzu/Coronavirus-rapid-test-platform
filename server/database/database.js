//make connection to remote database
const { createConnection } = require("mysql");

const query = createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USE,
  password: process.env.DB_PASS,
  database: process.env.MYSQL_DB,
  port: process.env.DB_PORT,
  connectionLimit: 10,
});

module.exports = query;
