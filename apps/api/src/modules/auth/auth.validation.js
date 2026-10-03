const { z, email } = require("zod");

const signUpSchema = z.object({
  name: z.string().min(2, "Name must be atleast 2 characters long"),
  email: z.email("Please provide a valid email address"),
  password: z.string().min(6, "Password must be 6 characters long")
});

const loginSchema = z.object({
  email: z.email(2, "Name must be atleast 2 characters long"),
  password: z.string().min(6)
});

module.exports = {
  signUpSchema,
  loginSchema
}