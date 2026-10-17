
const { z } = require("zod");

const createUrlSchema = z.object({
  originalUrl: z.url("Please provide a valid URL"),
});

const updateUrlSchema = z.object({
  originalUrl: z.url("Please provide a valid URL"),
});

module.exports = {
  createUrlSchema,
  updateUrlSchema,
};
