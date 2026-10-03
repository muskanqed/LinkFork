const authService = require("./auth.service");

const signup = async (req, res) => {
  try {
    const result = await authService.signup(req.body);

    res.cookie("token", result.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.status(201).json({
      success: true,
      message: "Signup successful",
      data: {
        user: result.user
      }
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
    const result = await authService.login(req.body);

    res.cookie("token", result.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.status(200).json({
      success: true,
      message: "Login successful",
      data: {
        user: result.user,
      },
    });
  } catch (error) {
    console.error(error);

    return res.status(401).json({
      success: false,
      message: error.message,
    });
  }
};

const getMe = async (req, res) => {
  try {
    const user = await authService.getMe(req.userId);

    res.status(200).send({
      success: true,
      data: user,
    })
  }
  catch (error) {
    console.log(error);

    res.status(400).send({
      success: false,
      message: error.message
    })
  }
}

const logout = async (req, res) => {
  res.clearCookie("token");

  return res.status(200).json({
    success: true,
    message: "Logout successful",
  });
};

module.exports = {
  signup,
  login,
  logout,
  getMe
}