const { nanoid } = require("nanoid");

const urlRepository = require("./url.repository");
const { createUrlSchema } = require("./url.validation");

const createUrl = async (data, userId) => {
  const validatedData = createUrlSchema.parse(data);

  const shortCode = nanoid(7);

  const url = await urlRepository.createUrl({
    userId,
    originalUrl: validatedData.originalUrl,
    shortCode,
  });

  return {
    id: url.id,
    originalUrl: url.originalUrl,
    shortCode: url.shortCode,
    createdAt: url.createdAt,
  };
};

const getUrls = async (userId) => {
  return urlRepository.findByUserId(userId);
};

module.exports = {
  createUrl,
  getUrls
};