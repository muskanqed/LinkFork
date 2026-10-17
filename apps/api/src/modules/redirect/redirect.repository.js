const prisma = require("../../config/db");

const findByShortCode = async (shortCode) => {
    return prisma.url.findUnique({
        where: { shortCode },
        select: {
            id: true,
            originalUrl: true,
        },
    });
};

module.exports = {
    findByShortCode
}