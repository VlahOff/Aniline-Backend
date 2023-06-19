const cryptoController = require('express').Router();
const { query, validationResult } = require('express-validator');

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
			message: errorParser(error),
		});
	}
});

cryptoController.get(
	'/topHundred',
	query('page')
		.trim()
		.matches(/^[1-9]\d*$/)
		.withMessage('NO_PAGE_NUMBER'),
	async (req, res) => {
		try {
			const { errors } = validationResult(req);
			if (errors.length > 0) {
				throw errors;
			}

			const response = await cryptoApi.getTopHundred(req.query.page);

			res.status(200).json(response);
		} catch (error) {
			let statusCode = 400;
			if (error.response?.status) {
				statusCode = error.response.status;
			}

			res.status(statusCode).json({
				message: errorParser(error),
			});
		}
	}
);

cryptoController.get(
	'/newCoins',
	query('page')
		.trim()
		.matches(/^[1-9]\d*$/)
		.withMessage('NO_PAGE_NUMBER'),
	async (req, res) => {
		try {
			const { errors } = validationResult(req);
			if (errors.length > 0) {
				throw errors;
			}

			const response = await cryptoApi.newCoinsToday(req.query.page);

			res.status(200).json(response);
		} catch (error) {
			let statusCode = 400;
			if (error.response?.status) {
				statusCode = error.response.status;
			}

			res.status(statusCode).json({
				message: errorParser(error),
			});
		}
	}
);

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
			message: errorParser(error),
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
			message: errorParser(error),
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
			message: errorParser(error),
		});
	}
});

cryptoController.get(
	'/convert',
	query('amount')
		.trim()
		.matches(/^(?=.*[1-9])\d*(?:\.\d+)?$/gm)
		.withMessage('NO_AMOUNT_PROVIDED'),
	query('from')
		.trim()
		.isLength({ min: 1 })
		.withMessage('NO_FROM_VALUE_PROVIDED'),
	query('to').trim().isLength({ min: 1 }).withMessage('NO_TO_VALUE_PROVIDED'),
	async (req, res) => {
		try {
			const { errors } = validationResult(req);
			if (errors.length > 0) {
				throw errors;
			}

			const response = await cryptoApi.convert(
				req.query.amount,
				req.query.from,
				req.query.to
			);
			res.status(200).json(response);
		} catch (error) {
			let statusCode = 400;
			if (error.response?.status) {
				statusCode = error.response.status;
			}

			res.status(statusCode).json({
				message: errorParser(error),
			});
		}
	}
);

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
			message: errorParser(error),
		});
	}
});

cryptoController.get(
	'/getCoinDetails',
	query('coinId')
		.trim()
		.isLength({ min: 1 })
		.withMessage('NO_COIN_ID_PROVIDED'),
	async (req, res) => {
		try {
			const { errors } = validationResult(req);
			if (errors.length > 0) {
				throw errors;
			}

			const response = await cryptoApi.getCoinDetailed(req.query.coinId);
			res.status(200).json(response);
		} catch (error) {
			let statusCode = 400;
			if (error.response?.status) {
				statusCode = error.response.status;
			}

			res.status(statusCode).json({
				message: errorParser(error),
			});
		}
	}
);

cryptoController.get(
	'/getCoinChartData',
	query('coinId')
		.trim()
		.isLength({ min: 1 })
		.withMessage('NO_COIN_ID_PROVIDED'),
	query('days')
		.trim()
		.matches(/^[1-9]\d*$/)
		.withMessage('NO_DAYS_PERIOD_PROVIDED'),
	async (req, res) => {
		try {
			const { errors } = validationResult(req);
			if (errors.length > 0) {
				throw errors;
			}

			const response = await cryptoApi.getCoinChartData(
				req.query.coinId,
				req.query.days
			);
			res.status(200).json({ chartData: response });
		} catch (error) {
			let statusCode = 400;
			if (error.response?.status) {
				statusCode = error.response.status;
			}

			res.status(statusCode).json({
				message: errorParser(error),
			});
		}
	}
);

cryptoController.get(
	'/getCoinOHLC',
	query('coinId')
		.trim()
		.isLength({ min: 1 })
		.withMessage('NO_COIN_ID_PROVIDED'),
	query('days')
		.trim()
		.matches(/^[1-9]\d*$/)
		.withMessage('NO_DAYS_PERIOD_PROVIDED'),
	async (req, res) => {
		try {
			const { errors } = validationResult(req);
			if (errors.length > 0) {
				throw errors;
			}

			const response = await cryptoApi.getCoinOHLC(
				req.query.coinId,
				req.query.days
			);
			res.status(200).json({ coinOHLC: response });
		} catch (error) {
			let statusCode = 400;
			if (error.response?.status) {
				statusCode = error.response.status;
			}

			res.status(statusCode).json({
				message: errorParser(error),
			});
		}
	}
);

cryptoController.get(
	'/search',
	query('query')
		.trim()
		.isLength({ min: 1 })
		.withMessage('NO_SEARCH_QUERY_PROVIDED'),
	async (req, res) => {
		try {
			const { errors } = validationResult(req);
			if (errors.length > 0) {
				throw errors;
			}

			const response = await cryptoApi.search(req.query.query);
			res.status(200).json(response);
		} catch (error) {
			let statusCode = 400;
			if (error.response?.status) {
				statusCode = error.response.status;
			}

			res.status(statusCode).json({
				message: errorParser(error),
			});
		}
	}
);

module.exports = cryptoController;
