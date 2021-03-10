const MYSQL = require("mysql");
const FS = require("fs");
const config = require("./config.js");
const {executeSqldump} = require("./database.js");

//Delete old output file
if(FS.existsSync(config.test.outputFile)){
    FS.unlinkSync(config.test.outputFile);
}

let pool = MYSQL.createPool(config.database);
executeSqldump(pool, "./sqldump.sql").then(_ => {
    console.log("Executed SQL dump.");
    pool.end();
}).catch(console.log);