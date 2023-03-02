const { getCoinDetailed } = require('../api/cryptoApi');
const { createTransaction, getAllUserTransactions, deleteTransaction, editTransaction } = require('../service/transactionService');
const errorParser = require('../utils/errorParser');

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

portfolioController.post('/addTransaction', async (req, res) => {
  try {
    if (req.body.data.coinId === '') {
      throw new Error('ENTER_COIN_ID');
    }

    if (req.body.data.coinPrice <= 0) {
      throw new Error('COIN_PRICE_NOT_POSITIVE');
    }

    if (req.body.data.quantity <= 0) {
      throw new Error('QUANTITY_LEAST_ONES');
    }
    await createTransaction(req.body.data, req.user.userId);

    const result = await getDetailedTransactions(req.user.userId);
    res.status(200).json(result);
  } catch (error) {
    res.status(400).json({
      message: errorParser(error)
    });
  }
});

portfolioController.put('/editTransaction', async (req, res) => {
  try {
    if (req.body.transaction.coinId === '') {
      throw new Error('ENTER_COIN_ID');
    }

    if (req.body.transaction.coinPrice <= 0) {
      throw new Error('COIN_PRICE_NOT_POSITIVE');
    }

    if (req.body.transaction.quantity <= 0) {
      throw new Error('QUANTITY_LEAST_ONES');
    }
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
    res.status(200).end();
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