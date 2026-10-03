const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const authRepository = require("./auth.repository");
const { signUpSchema, loginSchema } = require("./auth.validation");
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
    user: {
      id: user.id,
      name: user.name,
      email: user.email
    },
    token,
  };
};

const login = async (data) => {
  const validatedData = loginSchema.parse(data);

  const user = await authRepository.findByEmail(
    validatedData.email
  );

  if (!user) {
    throw new Error("Invalid email or password");
  }

  const passwordMatch = await bcrypt.compare(
    validatedData.password,
    user.password
  );

  if (!passwordMatch) {
    throw new Error("Invalid email or password");
  }

  const token = jwt.sign(
    { userId: user.id },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );

  return {
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
    },
    token,
  };
};

const getMe = async (userId) => {
  const user = await authRepository.findById(userId);

  if (!user) {
    throw new Error("User not found");
  }

  return {
    id: user.id,
    name: user.name,
    email: user.email
  }

}

module.exports = {
  signup,
  login,
  getMe
};