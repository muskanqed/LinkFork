const prisma = require("../../config/db");

const createClick = async (urlId) => {
    return prisma.click.create({
        data: {
            urlId
        }
    });
};

const getClicksByUrlId = async (userId) => {
    return prisma.url.findMany({
        where: { userId },
        include: {
            _count: { select: { clicks: true } },
        },
        orderBy: { createdAt: "desc" },
    });
};

const getAllUserClicks = async (userId) => {
    return prisma.url.findMany({
        where: {
            userId
        },
        include: {
            _count: {
                select: {
                    clicks: true,
                    clicks: { orderBy: { createdAt: "desc" } },
                }
            }
        },
        orderBy: {
            createdAt: "desc"
        }
    })
}

module.exports = {
    createClick,
    getClicksByUrlId,
    getAllUserClicks
}