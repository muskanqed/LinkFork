const redirectService = require("./redirect.service");

const redirect = async (req, res, next) => {
    try {
        const originalUrl = await redirectService.redirectUrl(req.params.shortCode, req.ip)

        return res.redirect(302, originalUrl)
    } catch (error) {
        next(error)
    }
};

module.exports = { redirect };