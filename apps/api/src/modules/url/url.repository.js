const prisma = require("../../config/db");

const createUrl = async (data) => {
  return prisma.url.create({
    data,
    select: {
      id: true,
      originalUrl: true,
      shortCode: true,
      createdAt: true,
      updatedAt: true
    }
  })
}

const findByUserId = async (userId) => {
  return prisma.url.findMany({
    where: { userId },
    select: {
      id: true,
      originalUrl: true,
      shortCode: true,
      createdAt: true,
      updatedAt: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
};

const findById = async (id) => {
  return prisma.url.findById({
    where: {
      id
    }
  })
}

const updateUrl = async (id, data) => {
  return prisma.url.update({
    where: {
      id
    },
    data,
    select: {
      id: true,
      originalUrl: true,
      shortCode: true,
      createdAt: true,
      updatedAt: true
    }
  })
}

const deleteUrl = async (id) => {
  return prisma.url.delete({
    where: {
      id
    },
    select: {
      id: true,
      originalUrl: true,
      shortCode: true
    }
  })
}

module.exports = {
  createUrl,
  findByUserId,
  findById,
  updateUrl,
  deleteUrl
}