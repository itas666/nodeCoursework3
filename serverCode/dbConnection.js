const mysql = require('mysql');

//Create a connection pool with the user details
const connectionPool = mysql.createPool({
    connectionLimit: 1,
    host: "localhost",
    user: "cw3WebUser",
    password: "cw3AdminUser!",
    database: "cw3",
    debug: false
});

module.exports = connectionPool;