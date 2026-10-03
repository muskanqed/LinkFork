const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const authRepository = require("./auth.repository");
const { signUpSchema } = require("./auth.validation");
const { email } = require("zod");

const signup = async (data) => {
  const validatedData = signUpSchema.parse(data);

  const existingUser = await authRepository.findByEmail(
    validatedData.email
  );

  if (existingUser) {
    throw new Error("User already exists");
  }

  const hashedPassword = await bcrypt.hash(validatedData.password, 10);

  const user = await authRepository.createUser({
    name: validatedData.name,
    email: validatedData.email,
    password: hashedPassword,
  });

  const token = jwt.sign(
    { userId: user.id },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );

  return {
    user:{
      id: user.id,
      name: user.name,
      email:user.email
    },
    token,
  };
};

module.exports = {
  signup,
};