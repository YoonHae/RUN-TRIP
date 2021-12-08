const bcrypt = require('bcrypt');

const saltRounds = 10;
generateHash = async (password) => {
    console.log('password changed');
    const salt = await bcrypt.genSalt(saltRounds);
    const hash = await bcrypt.hash(password, salt);
    return hash;
};

compareHash = async (password, hash) => {
    return await bcrypt.compare(password, hash);
}

module.exports = {generateHash, compareHash}