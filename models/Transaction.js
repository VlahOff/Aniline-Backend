const { Schema, model, Types: { ObjectId } } = require('mongoose');

const transactionSchema = new Schema({
  coinId: { type: String, required: true },
  coinPrice: { type: Number, required: true },
  quantity: { type: Number, required: true },
  owner: { type: ObjectId, ref: 'User' }
});

const Transaction = model('Transaction', transactionSchema);

module.exports = Transaction;

// {
//   "coin": "bitcoi",
//   "coinPrice": 20000,
//   "quantity": 0.0125
// }