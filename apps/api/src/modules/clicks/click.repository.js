const prisma = require("../../config/db");

const createClick = async (urlId) => {
    return prisma.click.create({
        data: {
            url: {
                connect: {
                    id: urlId
                }
            }
        }
    })
}

module.exports = {
    createClick
}