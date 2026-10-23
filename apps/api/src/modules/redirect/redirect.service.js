const redirectRepository = require("./redirect.repository");
const clickService = require("../clicks/click.service");
const geoIPService = require("../geoip/geoip.service");

const redirectUrl = async (shortCode, ipAddress) => {
    const url = await redirectRepository.findByShortCode(shortCode)

    if (!url) {
        const error = new Error("URL not found")
        error.statusCode = 404;
        throw error;
    }

    const location = await geoIPService.lookupLocation(ipAddress)

    await clickService.recordClicks(url.id, location)

    return url.originalUrl
}

module.exports = {
    redirectUrl
}