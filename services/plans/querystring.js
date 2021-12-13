module.exports.INSERT_PLAN = "insert into plans set ?"
module.exports.UPDATE_PLAN = `
    update plans 
    set title = :title, description = :description, date = :date, images = :images, continent = :continent
    where id = :id;
`;

module.exports.DELETE_PLAN = "delete from plans where id = ?";

module.exports.SELECT_PLAN_WHERE_ID = `
    select p.id, p.user_id, p.title, p.description, p.date, p.images, p.continent, u.display_name
    from plans p
    left join users u on p.user_id = u.id
    where p.id = ?
`

module.exports.get_SELECT_PLAN_COUNT = (condition) =>{
    return `
        select count(1) as total_cnt
        from plans p
        ${condition.where};
    `
}

module.exports.get_SELECT_PLAN_LIST = (condition) =>{
    return `
    select main.*, users.display_name
    from (
        select id, user_id, date, title, images, continent
        from plans p
        ${condition.where}
        order by ${condition.sortBy} ${condition.order}
        limit ${condition.limit} offset ${condition.skip}
    ) as main left join users on main.user_id = users.id;
    `
}