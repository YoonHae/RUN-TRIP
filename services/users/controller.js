const { dbConnection } = require('.');
const hashHandler = require('../../utils/hash');
const query = require('./querystring');

async function register(req, res) {
    const requireField = ['email', 'password', 'name'];
    requireField.forEach(field => {
        if(!req.body[field]) {
            return res.json({success: false, message: `필수 입력값이 누락되었습니다. (${field})`,  data: field});
        }
    });
    let user = {
        email: req.body.email,
        password: await hashHandler.generateHash(req.body.password),
        name: req.body.name,
        display_name: req.body.display_name || req.body.name,
        image: req.body.image
    }

    dbConnection.query(query.INSERT_USER, user, function(err, results) {
        if (err) {
            console.error(err);
            return res.status(500).json({ success: false, err });
        } else {
            return res.status(200).json({
                success: true
            });
        }
    });
}

function login(req, res) {
    res.json({result: 'login'});
}

function logout(req, res) {
    res.json({result: 'logout'});
}

function auth(req, res){
    dbConnection.query(query.SELECT_ALL_USER, [], (error, results) => {
        if (error)  {
            console.error(error);
            res.send('error');
        } else {
            hashHandler.generateHash('abc').then((hash) => {
                hashHandler.compareHash('abc', hash).then((isMatch) => {
                    res.send(JSON.stringify(results) + " " + hash + " " + isMatch);
                })
            });
        }
    });        


}




module.exports = {register, login, logout, auth};