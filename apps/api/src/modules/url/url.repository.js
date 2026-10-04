const prisma = require("../../config/db");

const createUrl = async (data) => {
  return prisma.url.create({
    data
  })
}

const findUrl = async(originalUrl)=>{
  return prisma.url.findFirst
}

module.exports = {
  createUrl
}