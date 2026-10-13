const { call } = require('../lib/tradehand');

const perform = async (z, bundle) => {
  const result = await call(
    z,
    'get_trader',
    { publicReference: bundle.inputData.publicReference },
    'TRADER_NOT_LISTED',
  );
  if (!result) return [];
  const { data } = result.structuredContent;
  return [{ id: data.trader.publicReference, ...data.trader }];
};

module.exports = {
  key: 'get_trader',
  noun: 'Trader',
  display: {
    label: 'Find Trader by Reference',
    description: 'Finds a trader from its Tradehand public reference.',
  },
  operation: {
    inputFields: [
      {
        key: 'publicReference',
        label: 'Public Reference',
        required: true,
        helpText:
          'The reference from a Find Trader result, for example `bespoke-gas-ltd-so30`.',
      },
    ],
    perform,
    sample: {
      id: 'bespoke-gas-ltd-so30',
      publicReference: 'bespoke-gas-ltd-so30',
      name: 'Bespoke Gas Ltd',
      trade: 'heating_engineer',
      claimed: true,
      accreditations: ['gas-safe', 'oftec', 'f-gas'],
      profileUrl:
        'https://tradehand.com/heating-engineers/uk/winchester/bespoke-gas-ltd-so30',
      actions: ['instant_quote', 'catalogue'],
    },
    outputFields: [
      { key: 'id', label: 'ID' },
      { key: 'publicReference', label: 'Public Reference' },
      { key: 'name', label: 'Name' },
      { key: 'trade', label: 'Trade' },
      { key: 'claimed', label: 'Claimed by Owner', type: 'boolean' },
      { key: 'profileUrl', label: 'Profile URL' },
    ],
  },
};
