const userDB = require('.');
const query = require('./querystring');

function register(req, res) {
    
    res.json({result: 'register'});
}

function login(req, res) {
    res.json({result: 'login'});
}

function logout(req, res) {
    res.json({result: 'logout'});
}

function auth(req, res){
    userDB.query(query.SELECT_ALL_USER, [], (error, results) => {
        if (error)  {
            console.error(error);
            res.send('error');
        } else {
            res.send(results);
        }
    });        


}




module.exports = {register, login, logout, auth};