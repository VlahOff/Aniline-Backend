require('dotenv').config();
const express = require('express');
const cors = require('cors');
const corsConfig = require('./configs/corsConfig');
const databaseConfig = require('./configs/database');

const tokenParser = require('./middlewares/tokenParser');
const { isAuthenticated } = require('./middlewares/guards');

const cryptoController = require('./controllers/cryptoController');
const devCryptoController = require('./controllers/devCryptoController');
const portfolioController = require('./controllers/portfolioController');

const EXPRESS_PORT = process.env.EXPRESS_PORT;

async function start() {
	const app = express();
	const connectToDB = databaseConfig();

	app.use(cors(corsConfig));
	app.use(express.json());
	app.use(tokenParser());

	app.use('/crypto', cryptoController);
	app.use('/devCrypto', devCryptoController);
	app.use('/portfolio', isAuthenticated(), portfolioController);

	app.get('/', (req, res) => {
		res.status(200).send('It works!');
	});

	connectToDB.then(() => {
		app.listen(EXPRESS_PORT, () =>
			console.log('Crypto service listening on port: ' + EXPRESS_PORT)
		);
	});
}

start();
