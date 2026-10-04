const { z } = require("zod");

const createUrlSchema = z.object({
  originalUrl: z.url("Please provide a validate url")
})

module.exports = {
  createUrlSchema
}