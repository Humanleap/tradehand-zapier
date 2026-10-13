const tradeList = require('./triggers/trade_list');
const findTrader = require('./searches/find_trader');
const getTrader = require('./searches/get_trader');
const getTraderServices = require('./searches/get_trader_services');

module.exports = {
  version: require('./package.json').version,
  platformVersion: require('zapier-platform-core').version,
  flags: { cleanInputData: false },

  triggers: { [tradeList.key]: tradeList },
  searches: {
    [findTrader.key]: findTrader,
    [getTrader.key]: getTrader,
    [getTraderServices.key]: getTraderServices,
  },
};
