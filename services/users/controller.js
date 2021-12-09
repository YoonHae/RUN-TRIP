const { dbConnection, issueToken, destroyToken, getTokenInfo } = require('.');
const hashHandler = require('../../modules/hash');
const query = require('./querystring');

async function _auth(req, res, next) {
    const token = req.cookies.w_auth;
    const userInfo = await getTokenInfo(token);
    if(!userInfo) {
        return res.json({
            isAuth: false,
            error: true
        });
    }

    req.token = token;
    req.user = userInfo;
    next();
}

function auth(req, res) {
    let userInfo = req.user;
    res.status(200).json({
        id: userInfo.id,
        isAdmin: userInfo.role === 0 ? false : true,
        isAuth: true,
        email: userInfo.email,
        role: userInfo.role,
        cart: [],
        history: []
    });
}

async function register(req, res) {
    // 필수값 체크
    for(var field of ['email', 'password', 'name']) {
        if(!req.body[field]) {
            return res.json({success: false, code: 501, message: `필수 입력값이 누락되었습니다. (${field})`,  data: field});
        }
    };

    // 이중 가입 체크로직 추가

    // 가입로직
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

async function login(req, res) {
    // 필수값 체크
    ['email', 'password'].forEach(field => {
        if(!req.body[field]) {
            return res.json({loginSuccess: false, code: 501, message: `필수 입력값이 누락되었습니다. (${field})`,  data: field});
        }
    });

    try {
        const results = await dbConnection.aQuery(query.SELECT_ALL_USER_WHERE_EMAIL, [req.body.email]);
        if(results.length === 1) {
            let user = results[0];
            const isMatch = await hashHandler.compareHash(req.body.password, user.password);
            if (isMatch) {
                const tokens = await issueToken(user);
                res.cookie("w_authExp", tokens.tokenExp);
                res.cookie("w_auth", tokens.token)
                    .status(200)
                    .json({
                        loginSuccess: true, userId: user.id
                    });
            } else {
                res.json({loginSuccess: false, code: 503, message: '비밀번호가 맞지 않습니다.'});
            }
        } else {
            res.json({loginSuccess: false, code: 502, message: '계정 정보가 존재하지 않습니다.'});
        }
    } catch (error) {
        console.error(error);
        return res.json({loginSuccess: false, code: 500,  data: error});
    }
}

async function logout(req, res) {
    await destroyToken(req.token);
    res.json({success: true});
}




module.exports = {register, login, logout, auth, _auth};