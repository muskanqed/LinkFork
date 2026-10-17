
const { nanoid } = require("nanoid");

const urlRepository = require("./url.repository");
const {
  createUrlSchema,
  updateUrlSchema,
} = require("./url.validation");

const createUrl = async (data, userId) => {
  const validatedData = createUrlSchema.parse(data);

  const shortCode = nanoid(7);

  return urlRepository.createUrl({
    userId,
    originalUrl: validatedData.originalUrl,
    shortCode,
  });
};

const getUrls = async (userId) => {
  return urlRepository.findByUserId(userId);
};

const getUrlById = async (id, userId) => {
  const url = await urlRepository.findById(id);

  if (!url || url.userId !== userId) {
    const error = new Error("URL not found");
    error.statusCode = 404;
    throw error;
  }

  const { userId: ownerId, ...publicUrl } = url;
  return publicUrl;
};

const updateUrl = async (id, data, userId) => {
  const existingUrl = await urlRepository.findById(id);

  if (!existingUrl || existingUrl.userId !== userId) {
    const error = new Error("URL not found");
    error.statusCode = 404;
    throw error;
  }

  const validatedData = updateUrlSchema.parse(data);

  return urlRepository.updateUrl(id, {
    originalUrl: validatedData.originalUrl,
  });
};

const deleteUrl = async (id, userId) => {
  const existingUrl = await urlRepository.findById(id);

  if (!existingUrl || existingUrl.userId !== userId) {
    const error = new Error("URL not found");
    error.statusCode = 404;
    throw error;
  }

  return urlRepository.deleteUrl(id);
};

module.exports = {
  createUrl,
  getUrls,
  getUrlById,
  updateUrl,
  deleteUrl,
};
