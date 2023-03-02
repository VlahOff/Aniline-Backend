const { getCoin } = require('./cryptoApi');

async function r() {
  const res = await getCoin('bitcoin');

  console.log(res);
}

r();