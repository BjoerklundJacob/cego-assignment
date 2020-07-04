const MYSQL = require("mysql");
const FS = require("fs");

//Create MySQL pool
let pool = MYSQL.createPool({
  host: "localhost",
  user: "root",
  password: "",
  database: "cego",
  connectionLimit: 25
});

moveDBTableToFS("users", "output.csv", 1000).then(()=>{
  //Close pool
  pool.end((error) => {
    if(error){
      throw error;
    }
  });
}).catch(error => {
  console.log(error);
  //Close pool
  pool.end((error) => {
    if(error){
      throw error;
    }
  });
});

/////////////////////
///// FUNCTIONS /////
/////////////////////

/**@description Moves all rows from a database table to a file in csv format
 * deleting the table content once all rows have been moved
  *@param table string - name of the table to move
  *@param filename string - name of the file (should be a text fileformat like .txt or .csv)
  @param selectLimit number - defaults to all rows at once, but can be changed to limit memory usage
*/
async function moveDBTableToFS(table, filename, selectLimit = 0){

  return new Promise(async(resolve, reject) => {
    //Initialise output file with header row
    await initOutputFile(table, filename);

    //Copy rows from database to a file
    copyRowsToFile(table, filename, selectLimit).then(() => {
      //Delete from database if no errors
      deleteTableContent(table).then(() => {
        resolve();
      });
    }).catch(error => {
      reject(error);
    });
  });
}

/**@description Deletes every row in the given table
  *@param table string - name of the table
*/
async function deleteTableContent(table){
  return new Promise((resolve, reject) => {
    pool.query(`DELETE FROM ${table}`,(error, results, fields) => {
      if (error){
        reject(error);
      }
      else{
        resolve(results);
      }
    });
  });
}
/**@description Copies every row in table to a file with the given filename
  *@param table string - name of table
  *@param filename string - name of file to append data to
  *@param selectLimit number - 0 if all rows should be copied at once or positive integer if copying should be done in sections
*/
async function copyRowsToFile(table, filename, selectLimit){
  //Copy all at once
  if(selectLimit === 0){
    //Get all users in one query
    pool.query(`SELECT * FROM ${table}`, (error, results, fields) => {
      if (error){
        throw error;
      }
      //Append the users in results to file
      appendUsersToFile(filename, results);
    });
  }
  //Copy in sections
  else{
    await copyRows(table, filename, selectLimit, 0);
  }
}

/**@description Copies rows from a table to file until all rows are copied
  *@param table string - name of table
  *@param filename string - name of file to append rows to
  *@param selectLimit number - limit of rows for each call
  *@param offset number - offset to select rows from
*/
async function copyRows(table, filename, selectLimit, offset){
  let res;
  do{
    res = await copyRowsAux(table, filename, selectLimit, offset);
    offset += res;
  }
  while(res >= selectLimit);
  return;
}

/**@description Helper function to copyRows. Copies rows from a table to file resolving with the amount of copied rows. 
  *@param table string - name of table
  *@param filename string - name of file to append rows to
  *@param selectLimit number - limit of rows for each call
  *@param offset number - offset to select rows from
*/
async function copyRowsAux(table, filename, selectLimit, offset){
  return new Promise((resolve, reject) => {
    pool.getConnection((error, connection) => {
      if(error){
        reject(error);
      }
      //If connection is established without error make query
      connection.query(`SELECT * FROM ${table} LIMIT ${selectLimit} OFFSET ${offset}`, (error, results, fields) => {
        //Release connection to the pool after query
        connection.release();
    
        //Handle any errors the query resulted in
        if(error){
          reject(error);
        }
    
        //Use results
        let users = appendUsersToFile(filename, results);
        //Resolve with the amount of moved rows
        resolve(users);
      });
    });
  });
}

/**@description Appends the users given in results to a file converting the data to a csv format
  *@param filename string - name of file
  *@param results object - iterateable object returned from a mysql query
  *@return amount of appended users
*/
function appendUsersToFile(filename, results){
  //Append to the output file
  let users = 0;
  for(let user of results){
    ++users;
    //Convert user to csv string
    let str = Object.values(user).join(";") + "\n";
    console.log(str);
    FS.appendFile(filename, str, "utf8", (error) => {
      //Throw error if something goes wrong
      if(error){
        throw error;
      }
    });
  }
  return users;
}

/**@description Initialises the output file with a header row containing the keys for the values. 
  *Will throw error if the table is empty.
  *@param table string - name of the table (to obtain the keys)
  *@param filename string - name of the file to init
  */
async function initOutputFile(table, filename){
  //Get keys for header row in csv file
  return new Promise((resolve, reject) => {
    pool.query(`SELECT * FROM ${table} LIMIT 1`, (error, results, fields) => {
      if(error){
        reject(error);
      }
      
      if(results === undefined){
        return reject(new Error("Table is empty"));
      }
      //Get all keys for header rows in output csv file
      let keyStr = Object.keys(results[0]).join(";") + "\n";
      //Write to file
      FS.writeFileSync(filename, keyStr, "utf8");
      
      resolve();
    });
  });
}