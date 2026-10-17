const redirectRepository = require("./redirect.repository");
const clickRepository = require("../clicks/click.repository")

const redirectUrl = async (shortCode) => {
    const url = await redirectRepository.findByShortCode(shortCode)

    if (!url) {
        const error = new Error("URL not found")
        error.statusCode = 404;
        throw error;
    }

    await clickRepository.createClick(url.id)

    return url.originalUrl
}

module.exports = {
    redirectUrl
}