const Plan = require('./models').Plan;


async function getCachedPlanList(queryCondition) {
    let condition = {};
    // 날짜조건
    condition.date = {$gte: queryCondition.date1};
    if (queryCondition.date2) condition.date["$lte"] = queryCondition.date2;

    // 지역조건
    if (queryCondition.continents && queryCondition.continents.length) {
        condition.continent = {'$in': queryCondition.continents};
    }

    if(queryCondition.term) {
        condition.title = { $regex: `${queryCondition.term}` }
    }

    let plans = await Plan.find(condition)
                        .sort([['date', 'asc'], ['id', 'desc']])
                        .skip(queryCondition.skip)
                        .limit(queryCondition.limit);

    return plans;
}

async function putCachedPlanList(newPlan) {
    // 캐시 데이터 정리
    const getPlan = await Plan.find({ 'id': newPlan.id});
    let mongoPlan = new Plan(newPlan);
    if (getPlan.length) {
        mongoPlan = mongoPlan.toObject();
        delete  mongoPlan['_id'];
        await Plan.updateOne({'_id': getPlan[0]._id}, {$set: mongoPlan})
    } else {
        await mongoPlan.save();
    }
}

async function deleteCachedPlanList(id) {
    await Plan.deleteOne({ 'id': id });
}

module.exports = {getCachedPlanList, putCachedPlanList, deleteCachedPlanList};