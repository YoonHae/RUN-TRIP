
const mysql = require('mysql');
const dbConnection = mysql.createConnection({
    host: global.custom_env.DB_CONFIG.host,
    user: global.custom_env.DB_CONFIG.user,
    password: global.custom_env.DB_CONFIG.password,
    database: global.custom_env.DB_CONFIG.database,
});

dbConnection.connect(function(err, args) {
    if (err) {
        console.error('[plans] mysql connection');
        console.error(err);
    } else {
        console.log('[plans] mysql connection!!');
    }
});

dbConnection.aQuery = (query, params={}) => {
    return new Promise((resolve, reject) => {
        dbConnection.query(query, params, (error, results) => {
            if (error) reject(error);
            else resolve(results);
        })
    })
}

module.exports = { dbConnection };