
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
    res.json({result: 'auth'});
}




module.exports = {register, login, logout, auth};