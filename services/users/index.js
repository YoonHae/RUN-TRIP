
const mysql = require('mysql');
const dbConnection = mysql.createConnection({
    host: global.custom_env.DB_CONFIG.host,
    user: global.custom_env.DB_CONFIG.user,
    password: global.custom_env.DB_CONFIG.password,
    database: global.custom_env.DB_CONFIG.database,
});

dbConnection.connect(function(err, args) {
    if (err) {
        console.error('[users] mysql connection');
        console.error(err);
    } else {
        console.log('[users] mysql connection!!');
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
const moment = require('moment');

const jwt = require('jsonwebtoken');
const customRedis = require('../../modules/redis-manager');
const redisManager = new customRedis(
    global.custom_env.REDIS_CONFIG.primary_host, 
    global.custom_env.REDIS_CONFIG.base_host, 
    global.custom_env.REDIS_CONFIG.port, 
    global.custom_env.REDIS_CONFIG.user, 
    global.custom_env.REDIS_CONFIG.password
    );
redisManager.connect().then(()=>console.log('redis connect!!'));



async function issueToken(userInfo) {
    // todo: token 생성시 timestamp 를 더해서 항상 토큰이 변경될 수 있도록 수정해야함
    var token = jwt.sign(userInfo.id.toString(), global.custom_env.SECRET_KEY.jwt);

    let values = {
        id: userInfo.id,
        email: userInfo.email,
        display_name: userInfo.display_name,
        role: userInfo.role
    }
       
    await redisManager.set(token, JSON.stringify(values), global.custom_env.REDIS_CONFIG.ttl);
    const oneHour = moment().add(1, 'hour').valueOf();

    return {token: token, tokenExp: oneHour};
}


async function destroyToken(token) {
    await redisManager.del(token);
}


async function getTokenInfo(token) {
    if(token) {
        let userStr = null;
        try {
            userStr = await redisManager.get(token, global.custom_env.REDIS_CONFIG.ttl);
        }catch (error) {
            console.log(error);
        }
        let ret = userStr ? JSON.parse(userStr) : userStr;
        return ret;
    } else {
        return null;
    }
}


module.exports = { dbConnection, issueToken, destroyToken, getTokenInfo };