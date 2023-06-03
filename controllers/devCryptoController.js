const devCryptoController = require('express').Router();

const cryptoApi = require('../api/cryptoApi');
const errorParser = require('../utils/errorParser');

const { dummyTopThree, dummyTopHundred, dummyNewCoins, dummyCryptoMap, dummyFiatMap, dummyAllCoins, dummyGlobalData, dummyCoinDetails, dummyCoinOHLC } = require('../dummyData');

devCryptoController.get('/topThree', async (req, res) => {
  try {
    res.status(200).json(dummyTopThree);
  } catch (error) {
    let statusCode = 400;
    if (error.response.status) {
      statusCode = error.response.status;
    }

    res.status(statusCode).json({
      message: errorParser(error)
    });
  }
});

devCryptoController.get('/topHundred', async (req, res) => {
  try {
    const page = req.query.page;
    console.log(page);
    res.status(200).json(dummyTopHundred);
  } catch (error) {
    let statusCode = 400;
    if (error.response.status) {
      statusCode = error.response.status;
    }

    res.status(statusCode).json({
      message: errorParser(error)
    });
  }
});

devCryptoController.get('/newCoins', async (req, res) => {
  try {
    const page = req.query.page;
    console.log(page);
    res.status(200).json(dummyNewCoins);
  } catch (error) {
    let statusCode = 400;
    if (error.response.status) {
      statusCode = error.response.status;
    }

    res.status(statusCode).json({
      message: errorParser(error)
    });
  }
});

devCryptoController.get('/cryptoMap', async (req, res) => {
  try {
    res.status(200).json(dummyCryptoMap);
  } catch (error) {
    let statusCode = 400;
    if (error.response.status) {
      statusCode = error.response.status;
    }

    res.status(statusCode).json({
      message: errorParser(error)
    });
  }
});

devCryptoController.get('/fiatMap', async (req, res) => {
  try {
    res.status(200).json(dummyFiatMap);
  } catch (error) {
    let statusCode = 400;
    if (error.response.status) {
      statusCode = error.response.status;
    }

    res.status(statusCode).json({
      message: errorParser(error)
    });
  }
});

devCryptoController.get('/allCoins', async (req, res) => {
  try {
    res.status(200).json(dummyAllCoins);
  } catch (error) {
    let statusCode = 400;
    if (error.response.status) {
      statusCode = error.response.status;
    }

    res.status(statusCode).json({
      message: errorParser(error)
    });
  }
});

devCryptoController.get('/convert', async (req, res) => {
  try {
    const response = await cryptoApi.convert(req.query.amount, req.query.from, req.query.to);
    res.status(200).json(response);
  } catch (error) {
    let statusCode = 400;
    if (error.response.status) {
      statusCode = error.response.status;
    }

    res.status(statusCode).json({
      message: errorParser(error)
    });
  }
});

devCryptoController.get('/getGlobalData', async (req, res) => {
  try {
    res.status(200).json(dummyGlobalData);
  } catch (error) {
    let statusCode = 400;
    if (error.response.status) {
      statusCode = error.response.status;
    }

    res.status(statusCode).json({
      message: errorParser(error)
    });
  }
});

devCryptoController.get('/getCoinDetails', async (req, res) => {
  try {
    res.status(200).json(dummyCoinDetails);
  } catch (error) {
    let statusCode = 400;
    if (error.response.status) {
      statusCode = error.response.status;
    }

    res.status(statusCode).json({
      message: errorParser(error)
    });
  }
});


devCryptoController.get('/getCoinChartData', async (req, res) => {
  try {
    const response = await cryptoApi.getCoinChartData(req.query.coinId, req.query.days);
    res.status(200).json({ chartData: response });
  } catch (error) {
    let statusCode = 400;
    if (error.response.status) {
      statusCode = error.response.status;
    }

    res.status(statusCode).json({
      message: errorParser(error)
    });
  }
});

devCryptoController.get('/getCoinOHLC', async (req, res) => {
  try {
    res.status(200).json(dummyCoinOHLC);
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

devCryptoController.post('/search', async (req, res) => {
  try {
    const response = await cryptoApi.search(req.body.query);
    res.status(200).json(response);
  } catch (error) {
    let statusCode = 400;
    if (error.response.status) {
      statusCode = error.response.status;
    }

    res.status(statusCode).json({
      message: errorParser(error)
    });
  }
});

module.exports = devCryptoController;