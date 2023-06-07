const cryptoController = require('express').Router();

const cryptoApi = require('../api/cryptoApi');
const errorParser = require('../utils/errorParser');

cryptoController.get('/topThree', async (req, res) => {
  try {
    const response = await cryptoApi.getTopThree();
    res.status(200).json(response);
  } catch (error) {
    let statusCode = 400;
    if (error.response?.status) {
      statusCode = error.response.status;
    }

    res.status(statusCode).json({
      message: errorParser(error)
    });
  }
});

cryptoController.get('/topHundred', async (req, res) => {
  try {
    const page = req.query.page;
    const response = await cryptoApi.getTopHundred(page);

    res.status(200).json(response);
  } catch (error) {
    let statusCode = 400;
    if (error.response?.status) {
      statusCode = error.response.status;
    }

    res.status(statusCode).json({
      message: errorParser(error)
    });
  }
});

cryptoController.get('/newCoins', async (req, res) => {
  try {
    const page = req.query.page;
    const response = await cryptoApi.newCoinsToday(page);

    res.status(200).json(response);
  } catch (error) {
    let statusCode = 400;
    if (error.response?.status) {
      statusCode = error.response.status;
    }

    res.status(statusCode).json({
      message: errorParser(error)
    });
  }
});

cryptoController.get('/cryptoMap', async (req, res) => {
  try {
    const response = await cryptoApi.cryptoMap();
    res.status(200).json(response);
  } catch (error) {
    let statusCode = 400;
    if (error.response?.status) {
      statusCode = error.response.status;
    }

    res.status(statusCode).json({
      message: errorParser(error)
    });
  }
});

cryptoController.get('/fiatMap', async (req, res) => {
  try {
    const response = await cryptoApi.fiatMap();
    res.status(200).json(response);
  } catch (error) {
    let statusCode = 400;
    if (error.response?.status) {
      statusCode = error.response.status;
    }

    res.status(statusCode).json({
      message: errorParser(error)
    });
  }
});

cryptoController.get('/allCoins', async (req, res) => {
  try {
    const response = await cryptoApi.getListCoins();
    res.status(200).json(response);
  } catch (error) {
    let statusCode = 400;
    if (error.response?.status) {
      statusCode = error.response.status;
    }

    res.status(statusCode).json({
      message: errorParser(error)
    });
  }
});

cryptoController.get('/convert', async (req, res) => {
  try {
    const response = await cryptoApi.convert(req.query.amount, req.query.from, req.query.to);
    res.status(200).json(response);
  } catch (error) {
    let statusCode = 400;
    if (error.response?.status) {
      statusCode = error.response.status;
    }

    res.status(statusCode).json({
      message: errorParser(error)
    });
  }
});

cryptoController.get('/getGlobalData', async (req, res) => {
  try {
    const response = await cryptoApi.getGlobal();
    res.status(200).json(response);
  } catch (error) {
    let statusCode = 400;
    if (error.response?.status) {
      statusCode = error.response.status;
    }

    res.status(statusCode).json({
      message: errorParser(error)
    });
  }
});

cryptoController.get('/getCoinDetails', async (req, res) => {
  try {
    const response = await cryptoApi.getCoinDetailed(req.query.coinId);
    res.status(200).json(response);
  } catch (error) {
    let statusCode = 400;
    if (error.response?.status) {
      statusCode = error.response.status;
    }

    res.status(statusCode).json({
      message: errorParser(error)
    });
  }
});

cryptoController.get('/getCoinChartData', async (req, res) => {
  try {
    const response = await cryptoApi.getCoinChartData(req.query.coinId, req.query.days);
    res.status(200).json({ chartData: response });
  } catch (error) {
    let statusCode = 400;
    if (error.response?.status) {
      statusCode = error.response.status;
    }

    res.status(statusCode).json({
      message: errorParser(error)
    });
  }
});

cryptoController.get('/getCoinOHLC', async (req, res) => {
  try {
    const response = await cryptoApi.getCoinOHLC(req.query.id, req.query.days);
    res.status(200).json({ coinOHLC: response });
  } catch (error) {
    let statusCode = 400;
    if (error.response?.status) {
      statusCode = error.response.status;
    }

    res.status(statusCode).json({
      message: errorParser(error)
    });
  }
});

cryptoController.post('/search', async (req, res) => {
  try {
    const response = await cryptoApi.search(req.body.query);
    res.status(200).json(response);
  } catch (error) {
    let statusCode = 400;
    if (error.response?.status) {
      statusCode = error.response.status;
    }

    res.status(statusCode).json({
      message: errorParser(error)
    });
  }
});

module.exports = cryptoController;