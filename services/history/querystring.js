module.exports.INSERT_HISTORY = "insert into history set ?"
module.exports.SELECT_HISTORY_WHERE_USER_ID = `
    select j.id
        , u.id as writer_id, u.display_name as writer
        , p.id as plan_id, p.title, p.date, p.images, p.continent
    from history j
    left join plans p on j.plan_id = p.id
    left join users u on j.user_id = u.id
    where j.user_id = ?
`

module.exports.DELETE_HISTORY_WHERE_ID = "delete from history where id = ?;"