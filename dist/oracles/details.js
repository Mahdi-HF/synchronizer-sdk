"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.fetchDetails = void 0;

var _index = require("../utils/index.js");

const parseSectorName = sector => {
  switch (sector.toUpperCase()) {
    case 'STOCK' || 'XDAI-STOCK':
      return 'stock';

    case 'XDAI-CRYPTO':
      return 'crypto';

    default:
      return 'stock';
  }
};

const fetchDetails = async providerMapping => {
  try {
    if (!providerMapping) {
      throw new Error('providerMapping is missing @fetchSignatures');
    }

    const promises = providerMapping.map(provider => {
      const url = `${provider}/registrar-detail.json`;
      return (0, _index.makeHttpRequest)(url);
    });
    let responses = await Promise.allSettled(promises); // Modify output to get ride of excessive values

    return responses.map(response => {
      if (response.status !== 'fulfilled') {
        throw new Error(`response.status returns unfulfilled: ${response}`);
      }

      let tokens = (response === null || response === void 0 ? void 0 : response.value) ?? {};

      for (const symbol in tokens) {
        let value = tokens[symbol];
        tokens[symbol] = {
          name: value.name,
          sector: parseSectorName(value.sector),
          symbol: value.symbol,
          short_name: value.short_name,
          short_symbol: value.short_symbol,
          long_name: value.long_name,
          long_symbol: value.long_symbol
        };
      }

      return tokens;
    });
  } catch (err) {
    console.log('Something went wrong while trying to fetch details:');
    console.error(err);
    return {};
  }
};

exports.fetchDetails = fetchDetails;