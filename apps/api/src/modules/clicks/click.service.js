const clickRepository = require("./click.repository.js");

const recordClicks = async (urlId, location = {}) => {
    return clickRepository.createClick(urlId, ...location);
};

const getClicksByUrlId = async (userId) => {
    return clickRepository.getClicksByUrlId(userId);
};

const getAllUserClicks = async (userId) => {
    return clickRepository.getAllUserClicks(userId);
}

module.exports = {
    recordClicks,
    getClicksByUrlId,
    getAllUserClicks
}