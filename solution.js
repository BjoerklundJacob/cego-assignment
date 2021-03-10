const MYSQL = require("mysql");
const FS = require("fs");

const config = require("./config.js");
const database = require("./database.js");

//Create MySQL pool
let pool = MYSQL.createPool(config.database);

//Copy content to file
database.copyToFile(pool, config.test).then( result => {
  console.log(result);
  //If no errors were thrown the data has been correctly written to file
  database.dropTable(pool, config.test.table).then(result => {
    console.log(result);
    pool.end();
  });
}).catch( error => {
  console.log("FAILED!");
  console.log(error);
  pool.end(console.log);
});