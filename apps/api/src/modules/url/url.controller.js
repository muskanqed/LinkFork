const { success } = require("zod");
const urlService = require("./url.service");

const createUrl = async (req, res) => {
  try {
    const url = await urlService.createUrl(req.body, req.userId);

    return res.status(201).json({
      success: true,
      message: "URL created successfully",
      data: url,
    });
  } catch (error) {
    console.error(error);

    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

const getUrls = async (req, res) => {
  try {
    const urls = urlService.getUrls(req.userId);

    return res.status(200).send({
      success: true,
      data: urls
    });
  }
  catch (error) {
    console.log(error);

    return res.status(400).send({
      success: false,
      message: error.message
    });
  }
}

module.exports = {
  createUrl,
  getUrls
};