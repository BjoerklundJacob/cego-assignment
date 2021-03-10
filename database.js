const MYSQL = require("mysql");
const FS = require("fs");

/**@description Dropts the given table using the pool 
  *@param pool initialised MySQL pool
  *@param table the table to drop
*/
async function dropTable(pool, table){
    await executeQuery(pool, `DROP TABLE ${table}`);
    return `Table '${table}' dropped.`;
}

/**@description Copies a table to a csv file. 
 * The csv file has a header row for the key names and a row for each SQL enrty.
 * Copying is validated.
 *@throws Error if copying did not succeed.
*/
async function copyToFile(pool, {table, outputFile, batchSize}){
    //Initialize output csv file with a header row of the keys
    await initOutputFile(pool, table, outputFile);
    //Append users to file
    if(batchSize > 0){
        await copyInBatches(pool, table, outputFile, batchSize);
    }
    else{
        //Copy all rows at once
        executeQuery(pool, `SELECT * FROM ${table}`).then(results => {
            //Append the users in results to file
            appendUsersToFile(outputFile, results);

            //Validate that it was copied correct
            if(!validate(results, outputFile)){
                throw new Error("Copying to file failed. Data got corrupted.");
            }
        });
    }

    return `Copied ${table} to ${outputFile}.`;
}

/**@description Initialises the output file with a header row containing the keys for the values. 
  *Will throw error if the table is empty.
  *@param pool initialised MySQL pool
  *@param table string - name of the table (to obtain the keys)
  *@param filename string - name of the file to init
  *@throws if the table is empty.
  */
async function initOutputFile(pool, table, filename){
    //Get keys for header row in csv file
    results = await executeQuery(pool, `SELECT * FROM ${table} LIMIT 1`);
    //If table is empty throw error
    if(results === undefined) throw new Error("Table is empty.");

    //Combine all keys to the header row csv string
    let keyStr = Object.keys(results[0]).join(";") + "\n";
    //Write to file
    FS.writeFileSync(filename, keyStr, "utf8");
}

/**@description Copies a table to a file in batches 
  *@throws throws error if the copying fails or data gets corrupted 
*/
async function copyInBatches(pool, table, outputFile, batchSize){
    //Copy rows in batches
    let results;
    let offset = 0;
    do{
        results = await copyRows(pool, table, outputFile, batchSize, offset);
        offset += results.length;
        //Validate that it was copied correct
        if(!validate(results, outputFile)){
            throw new Error("Copying to file failed. Data got corrupted.");
        }
    }
    while(results.length >= batchSize);
}

/**@description Copies rows from a table to file by appending resolving with the copied rows. 
  *@param pool initialised MySQL pool
  *@param table string - name of table
  *@param filename string - name of file to append rows to
  *@param rows number - how many rows to copy
  *@param offset number - offset to select rows from
*/
async function copyRows(pool, table, filename, rows, offset){
    let results = await executeQuery(pool, `SELECT * FROM ${table} LIMIT ${rows} OFFSET ${offset}`);
    appendUsersToFile(filename, results);
    return results;
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
        FS.appendFileSync(filename, str, "utf8", (error) => {
            //Throw error if something goes wrong
            if(error) throw error;
        });
    }
    return users;
}

/**@description Executes a SQL query returning the result 
  *@throws throws SQL error if one occurs
*/
async function executeQuery(pool, query){
    return new Promise((resolve, reject) => {
        pool.query(query, (error, results, fields) => {
            if(error) return reject(error);
            resolve(results);
        })
    });
}

/**@description Executes a SQL dump 
  *@throws throws SQL error if one occurs 
*/
async function executeSqldump(pool, sqldumpFile){
    let sqldump = FS.readFileSync(sqldumpFile, "utf8");
    let queries = sqldump.split(";");

    for(let i = 0; i < queries.length; ++i){
        if(queries[i].trim().length > 0)
            _ = await executeQuery(pool, queries[i]);
    }
}

/**@description Validates that the results are in the file. */
function validate(results, file){
    //Validate that it was copied correct
    let fileContent = FS.readFileSync(file, "utf8");
    let rows = fileContent.split("\n", -1);
    for(let j = 0; j < results.length; ++j){
        let i;
        for(i = 1; i < rows.length; ++i){
            let resultString = Object.values(results[j]).join(";");
            if(resultString === rows[i])
                break;
        }
        //If result was not found in file
        if(i >= rows.length) return false;
    }
    return true;
}



exports.copyToFile = copyToFile;
exports.dropTable = dropTable;
exports.executeQuery = executeQuery;
exports.executeSqldump = executeSqldump;