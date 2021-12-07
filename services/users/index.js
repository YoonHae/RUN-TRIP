
const mysql = require('mysql');
const dbConnection = mysql.createConnection({
    host: global.custom_env.DB_CONFIG.host,
    user: global.custom_env.DB_CONFIG.user,
    password: global.custom_env.DB_CONFIG.password,
    database: global.custom_env.DB_CONFIG.database,
});

dbConnection.connect(function(err, args) {
    if (err) {
        console.error('mysql connection error' + err);
    } else {
        console.log('mysql connection!!');
    }
});

module.exports = { dbConnection };