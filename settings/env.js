
// linux => export NODE_ENV=development
// windows => set NODE_ENV=development
let _NODE_ENV = undefined;
if (!process.env.NODE_ENV) process.env.NODE_ENV = "localtest";

if (process.env.NODE_ENV.trim().toLowerCase() == 'production') {
    _NODE_ENV = require("./application.prod.json");
} else if (process.env.NODE_ENV.trim().toLowerCase() == 'development') {
    _NODE_ENV = require("./application.dev.json");
} else {
    _NODE_ENV = require("./application.local.json");
}

exports.DB_CONFIG = _NODE_ENV.aws_mysql_db;
exports.FACEBOOK_APP = _NODE_ENV.facebook_app;
exports.REDIS_CONFIG = _NODE_ENV.redis_db;

