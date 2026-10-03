const { signUpSchema, loginSchema } = require("./auth.validation");
const authService = require("./auth.service");

const signup = async (req, res) => {
  try {
    const result = await authService.signup(req.body);

    return res.status(201).json({
      success: true,
      message: "Signup successful",
      data: result
    });
  }
  catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }

}

const login = async (req, res) => {
  try {
    const vaildationData = loginSchema.parse(req.body);

    return res.status(201).json({
      success: true,
      message: "Signin successful"
    })
  }
  catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error"
    })
  }
}

const logout = async (req, res) => {
  try {
    // Logout logic will be added later

    return res.status(200).json({
      success: true,
      message: "Logout successful"
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
};

module.exports = {
  signup,
  login,
  logout
}