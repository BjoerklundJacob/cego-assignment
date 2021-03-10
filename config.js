const config = {
    database: {
        host: "localhost",
        user: "root",
        password: "",
        database: "cego",
        connectionLimit: 25
    },
    test: {
        table: "users",
        outputFile: "output.csv",
        batchSize: 1000//<= 0 means full set at once
    }
}

module.exports = config;