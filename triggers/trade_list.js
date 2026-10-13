const { call } = require('../lib/tradehand');

const perform = async (z) => {
  const trades = [];
  let cursor;
  do {
    const { data } = (
      await call(z, 'browse_trades', { limit: 20, cursor })
    ).structuredContent;
    trades.push(...data.trades);
    cursor = data.nextCursor;
  } while (cursor);
  return trades.map((t) => ({ id: t.value, name: t.plural }));
};

module.exports = {
  key: 'trade_list',
  noun: 'Trade',
  display: {
    label: 'Trade List',
    description: 'Triggers when a trade is available to pick in a dropdown.',
    hidden: true,
  },
  operation: {
    perform,
    sample: { id: 'electrician', name: 'Electricians' },
    outputFields: [
      { key: 'id', label: 'Trade ID' },
      { key: 'name', label: 'Trade Name' },
    ],
  },
};
