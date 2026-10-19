const clickRepository = require("./click.repository.js");

const getClicksByUrlId = async (userId) => {
    return clickRepository.getClicksByUrlId(userId);
};

const getAllUserClicks = async (userId) => {
    return clickRepository.getAllUserClicks(userId);
}

module.exports = {
    getClicksByUrlId,
    getAllUserClicks
}