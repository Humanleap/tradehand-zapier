const { call } = require('../lib/tradehand');

const perform = async (z, bundle) => {
  const result = await call(
    z,
    'get_service_options',
    { publicReference: bundle.inputData.publicReference },
    'TRADER_NOT_LISTED',
  );
  if (!result) return [];
  const { data } = result.structuredContent;
  return [
    {
      id: data.trader.publicReference,
      ...data.trader,
      services: data.services.map((name) => ({ name })),
    },
  ];
};

module.exports = {
  key: 'get_trader_services',
  noun: 'Trader Services',
  display: {
    label: 'Find Trader Services',
    description: 'Finds the services a trader offers.',
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
      services: [{ name: 'Boiler installation' }, { name: 'Boiler repair' }],
    },
    outputFields: [
      { key: 'id', label: 'ID' },
      { key: 'publicReference', label: 'Public Reference' },
      { key: 'name', label: 'Name' },
      { key: 'trade', label: 'Trade' },
      { key: 'profileUrl', label: 'Profile URL' },
      { key: 'services[]name', label: 'Services' },
    ],
  },
};
