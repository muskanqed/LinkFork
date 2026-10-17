
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

    return res.status(error.statusCode || 400).json({
      success: false,
      message: error.message,
    });
  }
};

const getUrls = async (req, res) => {
  try {
    const urls = await urlService.getUrls(req.userId);

    return res.status(200).json({
      success: true,
      data: urls,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch URLs",
    });
  }
};

const getUrlById = async (req, res) => {
  try {
    const url = await urlService.getUrlById(
      req.params.id,
      req.userId
    );

    return res.status(200).json({
      success: true,
      data: url,
    });
  } catch (error) {
    console.error(error);

    return res.status(error.statusCode || 400).json({
      success: false,
      message: error.message,
    });
  }
};

const updateUrl = async (req, res) => {
  try {
    const url = await urlService.updateUrl(
      req.params.id,
      req.body,
      req.userId
    );

    return res.status(200).json({
      success: true,
      message: "URL updated successfully",
      data: url,
    });
  } catch (error) {
    console.error(error);

    return res.status(error.statusCode || 400).json({
      success: false,
      message: error.message,
    });
  }
};

const deleteUrl = async (req, res) => {
  try {
    const url = await urlService.deleteUrl(
      req.params.id,
      req.userId
    );

    return res.status(200).json({
      success: true,
      message: "URL deleted successfully",
      data: url,
    });
  } catch (error) {
    console.error(error);

    return res.status(error.statusCode || 400).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  createUrl,
  getUrls,
  getUrlById,
  updateUrl,
  deleteUrl,
};
