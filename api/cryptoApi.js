const axios = require('axios');

const cgHost = 'https://api.coingecko.com/api/v3/';
const cmcHostVOne = 'https://pro-api.coinmarketcap.com/v1/';
const cmcHostVTwo = 'https://pro-api.coinmarketcap.com/v2/';

const CMC_API_KEY = process.env.CMC_API_KEY;
const cmcHeaders = {
	'X-CMC_PRO_API_KEY': CMC_API_KEY
};

const cryptoApi = {
	getGlobal: async () => {
		const t = await axios.get(cgHost + 'global');
		const data = t.data.data;

		return {
			total_market_cap: data.total_market_cap.usd,
			market_cap_change_percentage_24h_usd: data.market_cap_change_percentage_24h_usd,
			trading_volume: data.total_volume.usd,
			btc_dominance: data.market_cap_percentage.btc,
			number_of_coins: data.active_cryptocurrencies
		};
	},

	// decimal place for currency price value, default: 2
	getCoin: async (coin, precision) => {
		const t = await axios.get(cgHost + `simple/price?ids=${coin}&vs_currencies=usd&include_market_cap=true&include_24hr_vol=true&include_24hr_change=true&precision=${Number(precision) | 2}`);
		return t.data;
	},

	getCoinDetailed: async (coin) => {
		const t = await axios.get(cgHost + `coins/${coin}?localization=false&tickers=true&market_data=true&community_data=false&developer_data=false`);
		const data = t.data;
		const low_high_value = ((data.market_data.current_price.usd - data.market_data.low_24h.usd) * 100) / (data.market_data.high_24h.usd - data.market_data.low_24h.usd);

		return {
			id: data.id,
			symbol: data.symbol,
			name: data.name,
			image: data.image,
			current_price: data.market_data.current_price.usd,
			market_cap: data.market_data.market_cap.usd,
			total_volume: data.market_data.total_volume.usd,
			high_24h: data.market_data.high_24h.usd,
			low_24h: data.market_data.low_24h.usd,
			low_high_value: low_high_value > 0 ? low_high_value : 0,
			price_change_24h: data.market_data.price_change_24h,
			price_change_percentage_24h: data.market_data.price_change_percentage_24h,
			market_cap_change_24h: data.market_data.market_cap_change_24h,
			market_cap_change_percentage_24h: data.market_data.market_cap_change_percentage_24h,
			circulating_supply: data.market_data.circulating_supply,
			total_supply: data.market_data.total_supply,
			max_supply: data.market_data.max_supply,
			ath: data.market_data.ath.usd,
			ath_change_percentage: data.market_data.ath_change_percentage.usd,
			ath_date: data.market_data.ath_date.usd,
			atl: data.market_data.atl.usd,
			atl_change_percentage: data.market_data.atl_change_percentage.usd,
			atl_date: data.market_data.atl_date.usd,
			last_updated: data.market_data.last_updated
		};
	},

	getCoinChartData: async (coin, days) => {
		const t = await axios.get(cgHost + `coins/${coin}/market_chart?vs_currency=usd&days=${days}`);
		const data = t.data.prices;

		const chart = [];
		data.forEach(v => {
			chart.push({
				time: v[0],
				price: v[1]
			});
		});

		return chart;
	},

	getTopHundred: async () => {
		const t = await axios.get(cgHost + 'coins/markets?vs_currency=usd&order=market_cap_desc&per_page=100&page=1&sparkline=false&price_change_percentage=1h%2C24h%2C7d');

		const data = [];
		t.data.forEach((t) => {
			data.push({
				id: t.id,
				name: t.name,
				symbol: t.symbol,
				total_supply: t.total_supply,
				last_updated: t.last_updated,
				current_price: t.current_price,
				market_cap: t.market_cap,
				price_change_percentage_1h_in_currency: t.price_change_percentage_1h_in_currency,
				price_change_percentage_24h_in_currency: t.price_change_percentage_24h_in_currency,
				price_change_percentage_7d_in_currency: t.price_change_percentage_7d_in_currency,
				image: t.image,
			});
		});
		return data;
	},

	newCoinsToday: async () => {
		const t = await axios.get(cmcHostVOne + 'cryptocurrency/listings/latest?sort=date_added', { 'headers': cmcHeaders });
		const coinData = t.data.data;

		const ids = [];
		coinData.forEach((t) => {
			ids.push(t.slug);
		});

		let coinMetaData = await axios.get(cmcHostVTwo + `cryptocurrency/info?slug=${ids.join(',')}&aux=logo`, { 'headers': cmcHeaders });
		coinMetaData = coinMetaData.data.data;
		coinMetaData = Object.values(coinMetaData);
		coinMetaData = coinMetaData.reverse();

		const res = [];
		for (let i = 0; i < ids.length; i++) {
			res.push({
				id: coinData[i].slug,
				name: coinData[i].name,
				symbol: coinData[i].symbol.toLowerCase(),
				total_supply: coinData[i].total_supply,
				last_updated: coinData[i].last_updated,
				current_price: coinData[i].quote.USD.price,
				market_cap: coinData[i].self_reported_market_cap,
				price_change_percentage_1h_in_currency: coinData[i].quote.USD.percent_change_1h,
				price_change_percentage_24h_in_currency: coinData[i].quote.USD.percent_change_24h,
				price_change_percentage_7d_in_currency: coinData[i].quote.USD.percent_change_7d,
				image: coinMetaData[i].logo
			});
		}

		return res;
	},

	getListCoins: async () => {
		const t = await axios.get(cgHost + 'coins/list?include_platform=false');
		return t.data;
	},

	search: async (query) => {
		let t = await axios.get(`${cgHost}search?query=${query}`);
		return t.data.coins;
	},

	getTopThree: async () => {
		const temp = await cryptoApi.getTopHundred();
		const stableCoinsIds = ['tether', 'usd-coin', 'binance-usd', 'dai', 'paxos-standard', 'true-usd', 'usdd'];
		const res = [];

		while (res.length != 3) {
			const tempCoin = temp.shift();
			if (!stableCoinsIds.includes(tempCoin.id)) {
				res.push(tempCoin);
			}
		}

		return res;
	},

	cryptoMap: async () => {
		const t = await axios.get(cmcHostVOne + 'cryptocurrency/map?sort=cmc_rank', { 'headers': cmcHeaders });
		const arr = [];
		t.data.data.forEach(e => {
			const res = {
				id: e.id,
				name: e.name,
				slug: e.slug,
				symbol: e.symbol
			};
			arr.push(res);
		});
		return arr;
	},

	fiatMap: async () => {
		const t = await axios.get(cmcHostVOne + 'fiat/map', { 'headers': cmcHeaders });
		const arr = [];
		t.data.data.forEach(e => {
			const res = {
				id: e.id,
				name: e.name,
				sign: e.sign,
				symbol: e.symbol
			};
			arr.push(res);
		});
		return arr;
	},

	convert: async (amount, fromCurrency, toCurrency) => {
		const t = await axios.get(cmcHostVTwo + `tools/price-conversion?amount=${amount}&id=${fromCurrency}&convert_id=${toCurrency}`, { 'headers': cmcHeaders });
		return t.data.data;
	}
};

module.exports = cryptoApi;