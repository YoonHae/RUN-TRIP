const { dbConnection } = require('.');
const query = require('./querystring');


function register(req, res) {
    // 필수값 체크
    for(var field of ['plan_id']){
        if(!req.body[field]) {
            return res.json({success: false, code: 501, message: `필수 입력값이 누락되었습니다. (${field})`,  data: field});
        }
    }

    // todo : 이미 등록된 plan_id 있는지 체크

    let plan = {
        user_id: req.user.id,
        plan_id: req.body.plan_id
    }

    dbConnection.query(query.INSERT_HISTORY, plan, function(err, results) {
        if (err) {
            console.error(err);
            return res.status(500).json({ success: false, err });
        } else {
            console.log(results);
            return res.status(200).json({
                success: true, id: results.insertId
            });
        }
    });
}

async function getHistoryList(req, res) {
    
    // 전체 개수
    let results = await dbConnection.aQuery(query.SELECT_HISTORY_WHERE_USER_ID, [req.user.id]);
    for(var row of results) {
        if (row.images)
            row.images = row.images.split(';');
    }
    
    res.json({
        success: true, 
        history: results
    });
}

async function deleteHistory(req, res) {
    let results = await dbConnection.aQuery(query.DELETE_HISTORY_WHERE_ID, [req.params.id]);
    console.log(results);
    res.json({
        success: true,
        deleted_history_id: req.params.id
    });
    
}


module.exports = {register,  getHistoryList, deleteHistory};