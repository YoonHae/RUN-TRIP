const mongoose = require("mongoose");

const planSchema = mongoose.Schema({
    id: Number,
    user_id: Number,
    title: String,
    date: String,
    images: Array,
    continent: Number,
    display_name: String
});

module.exports.Plan = mongoose.model('Plan', planSchema);

