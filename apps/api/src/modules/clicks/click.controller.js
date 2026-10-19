const clickService = require('./click.service');

const getClicksByUrlId = async (req, res) => {
    try {

        const clicks = await clickService.getClicksByUrlId(req.userId);

        return res.status(200).send({
            success: true,
            data: clicks
        })
    }
    catch (error) {
        console.log(error);

        return res.status(500).send({
            success: false,
            message: error.message
        })
    }
}

const getAllUserClicks = async (req, res) => {
    try {
        const clicks = await clickService.getAllUserClicks(req.userId);

        return res.status(200).send({
            success: true,
            data: clicks
        })
    }
    catch (error) {
        console.log(error);

        return res.status(500).send({
            success: false,
            message: error.message
        })
    }
}

module.exports = {
    getClicksByUrlId,
    getAllUserClicks
}
