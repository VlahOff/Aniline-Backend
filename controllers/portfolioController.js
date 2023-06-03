const { getCoinDetailed } = require('../api/cryptoApi');
const { createTransaction, getAllUserTransactions, deleteTransaction, editTransaction } = require('../service/transactionService');
const errorParser = require('../utils/errorParser');
const { body, validationResult } = require('express-validator');

const portfolioController = require('express').Router();

portfolioController.get('/getTransactions', async (req, res) => {
  try {
    const result = await getDetailedTransactions(req.user.userId);
    res.status(200).json(result);
  } catch (error) {
    res.status(400).json({
      message: errorParser(error)
    });
  }
});

portfolioController.post('/addTransaction',
  body('transaction.coinId')
    .trim()
    .isLength({ min: 1 })
    .withMessage('ENTER_COIN_ID'),
  body('transaction.coinPrice')
    .trim()
    .isFloat({ gt: 0 })
    .withMessage('COIN_PRICE_NOT_POSITIVE'),
  body('transaction.quantity')
    .trim()
    .isFloat({ gt: 0 })
    .withMessage('QUANTITY_LEAST_ONES'),
  async (req, res) => {
    try {
      const { errors } = validationResult(req);
      if (errors.length > 0) {
        throw errors;
      }

      await createTransaction(req.body.transaction, req.user.userId);

      const result = await getDetailedTransactions(req.user.userId);
      res.status(200).json(result);
    } catch (error) {
      res.status(400).json({
        message: errorParser(error)
      });
    }
  });

portfolioController.put('/editTransaction',
  body('transaction.coinId')
    .trim()
    .isLength({ min: 1 })
    .withMessage('ENTER_COIN_ID'),
  body('transaction.coinPrice')
    .trim()
    .isFloat({ gt: 0 })
    .withMessage('COIN_PRICE_NOT_POSITIVE'),
  body('transaction.quantity')
    .trim()
    .isFloat({ gt: 0 })
    .withMessage('QUANTITY_LEAST_ONES'),
  async (req, res) => {
    try {
      await editTransaction(req.body.transaction, req.body.transactionId);

      const result = await getDetailedTransactions(req.user.userId);
      res.status(200).json(result);
    } catch (error) {
      res.status(400).json({
        message: errorParser(error)
      });
    }
  });

portfolioController.delete('/removeTransaction', async (req, res) => {
  try {
    await deleteTransaction(req.query.transactionId);
    res.status(200).json({});
  } catch (error) {
    res.status(400).json({
      message: errorParser(error)
    });
  }
});

async function getDetailedTransactions(userId) {
  const transactions = await getAllUserTransactions(userId);
  if (!transactions) {
    throw new Error('NO_TRANSACTIONS_FOR_USER');
  }

  const detailedTransactions = transactions.map((t) => {
    return t = getCoinDetailed(t.coinId);
  });

  const result = [];
  await Promise.all(detailedTransactions)
    .then((data) => {
      transactions.forEach((t, i) => {
        result.push(createTransactionDetailed(t, data[i]));
      });
    })
    .catch(err => { throw new Error(err); });

  return result;
}

function createTransactionDetailed(transactionData, details) {
  return {
    coinId: transactionData.coinId,
    boughtPrice: transactionData.coinPrice,
    quantity: transactionData.quantity,
    transactionId: transactionData._id,
    value: transactionData.quantity * details.current_price,
    pnlValue: (details.current_price - transactionData.coinPrice) * transactionData.quantity,
    pnlPercent: ((details.current_price * transactionData.quantity) - (transactionData.coinPrice * transactionData.quantity)) / (transactionData.coinPrice * transactionData.quantity) * 100,
    id: details.id,
    symbol: details.symbol,
    name: details.name,
    image: details.image.small,
    current_price: details.current_price,
    price_change_24h: details.price_change_24h,
    price_change_percentage_24h: details.price_change_percentage_24h
  };
}

module.exports = portfolioController;