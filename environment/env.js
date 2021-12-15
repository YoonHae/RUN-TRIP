// 기본 mysql 이 named placeholder 를 지원하지 않아서 추가 모듈 설치하여 사용
const toUnnamed = require('named-placeholders')();
const originalQuery = require('mysql/lib/Connection').prototype.query;

require('mysql/lib/Connection').prototype.query = function (...args) {
    if (Array.isArray(args[0]) || !args[1] 
        || (args[0].toLowerCase().indexOf('insert into') >= 0 && args[0].indexOf('?')>0)) {
        return originalQuery.apply(this, args);
    }

    ([
        args[0],
        args[1]
    ] = toUnnamed(args[0], args[1]));

    return originalQuery.apply(this, args);
};



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

console.log("environ : ", process.env.NODE_ENV);

exports.DB_CONFIG = _NODE_ENV.aws_mysql_db;
exports.FACEBOOK_APP = _NODE_ENV.facebook_app;
exports.REDIS_CONFIG = _NODE_ENV.redis_db;
exports.SECRET_KEY = _NODE_ENV.secret_key;
exports.AWS = _NODE_ENV.aws;
exports.API_SERVER = _NODE_ENV.api_server;
