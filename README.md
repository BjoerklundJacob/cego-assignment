# Job interview assignment solution
 The solution copies a table specified in config.js to a output file and validates the data. 
 If the data is copied correct, the table is dropped. 
 See 'How to use' section for how to run the program.
 ## Necesary installations
 - [Node.js](https://nodejs.org/) - Solution is made with Node.js v14.16.0

 ## Dependencies
 - [mysql](https://www.npmjs.com/package/mysql)
 ### Installation
 All dependencies can be installed using
 ```bash
 npm install
 ``` 

 ## How to use
 - Install all necesary installations and dependencies as descriped in dependency section.
 - Set up a mysql database and modify config.js to match the database configurations.
 - Run the solution using 
   ```bash
   node setup.js
   ```
   followed by 
   ```bash
   node solution.js
   ```
   or simply run the 
   ```
   ./test.bat
   ```

 ## Final considerations
 ### Security concerns
 Login credentials should not be placed where they are publicly available.
 ### Next steps
 Better error message if the connection to the database cannot be established.

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
