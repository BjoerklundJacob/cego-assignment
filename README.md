# Job interview assignment solution
 ## Necesary installations
 - [Node.js](https://nodejs.org/) - Solution is made with Node.js v12.14.1

 ## Dependencies
 - [mysql](https://www.npmjs.com/package/mysql)
 ### Installation
 All dependencies can be installed using
 ```bash
 npm install
 ``` 

 ## How to use
 - Set up a localhost MySQL database from the sqldump file and modify the options in MYSQL.createPool on line 5-11 in solution.js if needed.
 - Install all dependencies as descriped in dependency section.
 - Run the solution using 
   ```bash
   node solution.js
   ```
 - The table should now be empty and all the data should be in csv format in the output.csv file with an added header row containing the keys.

 ## Final considerations
 The current solution does little to no error handling, which should be improved for stability and useability. The validation of correct copying to a file is solely done by the errors from the npm modules, which should give errors if any issues occur. Since the modules will give errors if something with the SQL query or the file creation/writing the solution should ensure data integrity, but further validation could be implemented. The solution overrides the output file, so the output file should be a new file or using with caution on existing files.


# ORIGINAL README BELOW

# Job interview assignment
We kindly ask you to solve the task below. By solving and submitting this assignment you provide us with insights in how you solve real-world problems. What we will be looking at are topics such as: choice of technology, structuring of code, use of VCS, selection of 3rd party libraries, documentation etc.

## The task
Develop a solution that, given a select query, can read data from a database, write it to a local file and then delete the data from the database. The solution should verify that data is written to the file, and that data integrity is maintained, before deleting it from the database.

- Use Bash, PHP, JavaScript or Go as the language
- Use MySQL, MariaDB, CockroachDB or SQLite as the database

Please use the data set provided in the SQL dump in this repo. Please also consider that your solution should be able to handle much larger data sets.

## Expectations
Make a copy of this repo. Solve the task below. Push your code to a public repo, and send us the link as a reply to our email.

Your solution should include a short readme describing your solution, how to use/test it and any final considerations such as known errors, next steps, security concerns etc. Don’t worry we are not expecting this thing to be perfect.
