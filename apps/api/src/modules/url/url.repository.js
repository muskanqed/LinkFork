const prisma = require("../../config/db");

const createUrl = async (data) => {
  return prisma.url.create({
    data
  })
}

const findByUserId = async (userId) => {
  return prisma.url.findMany({
    where: {
      userId
    }
  })
}

module.exports = {
  createUrl,
  findByUserId
}