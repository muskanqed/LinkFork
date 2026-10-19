const redirectRepository = require("./redirect.repository");
const clickService = require("../clicks/click.service");

const redirectUrl = async (shortCode) => {
    const url = await redirectRepository.findByShortCode(shortCode)

    if (!url) {
        const error = new Error("URL not found")
        error.statusCode = 404;
        throw error;
    }

    await clickService.recordClicks(url.id)

    return url.originalUrl
}

module.exports = {
    redirectUrl
}