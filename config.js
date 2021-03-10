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
        batchSize: 1000
    }
}

module.exports = config;