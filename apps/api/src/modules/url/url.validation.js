
const { z } = require("zod");

const createUrlSchema = z.object({
  originalUrl: z.url("Please provide a valid URL"),
});

const updateUrlSchema = z.object({
  originalUrl: z.url("Please provide a valid URL"),
});

const paginationSchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number()
    .int()
    .refine((value) => [10, 25, 50].includes(value), {
      message: "Limit must be 10, 25, or 50"
    })
    .default(10)
});


module.exports = {
  createUrlSchema,
  updateUrlSchema,
  paginationSchema
};
