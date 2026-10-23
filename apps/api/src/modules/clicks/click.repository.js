const prisma = require("../../config/db");

const createClick = async (data) => {
    return prisma.click.create({
        data: {
            url: {
                connect: { id: data.urlId }
            },
            country: data.country ?? null,
            countryCode: data.countryCode ?? null,
            region: data.region ?? null,
            city: data.city ?? null
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