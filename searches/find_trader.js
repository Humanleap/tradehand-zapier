const { call } = require('../lib/tradehand');

const perform = async (z, bundle) => {
  const { trade, postcode, location } = bundle.inputData;
  const { listings } = (
    await call(z, 'search_traders', {
      trade,
      postcode: postcode || undefined,
      location: location || undefined,
    })
  ).structuredContent;
  return listings.map((l) => ({ id: l.publicReference, ...l }));
};

module.exports = {
  key: 'find_trader',
  noun: 'Trader',
  display: {
    label: 'Find Trader',
    description: 'Finds UK tradespeople and trade businesses by trade and place.',
  },
  operation: {
    inputFields: [
      {
        key: 'trade',
        label: 'Trade',
        required: true,
        dynamic: 'trade_list.id.name',
        helpText: 'The kind of tradesperson to look for.',
      },
      {
        key: 'postcode',
        label: 'Postcode',
        helpText:
          'A full UK postcode, for example `SW1A 1AA`. Fill this in or Town or City, not both.',
      },
      {
        key: 'location',
        label: 'Town or City',
        helpText:
          'A UK town, city or borough, for example `Winchester`. Fill this in or Postcode, not both.',
      },
    ],
    perform,
    sample: {
      id: 'semper-services-limited',
      publicReference: 'semper-services-limited',
      name: 'Semper Services Limited',
      trade: 'Electrician',
      location: 'City of Westminster, Westminster, London, WC2A',
      claimed: false,
      accreditations: ['niceic'],
      sourceRegister: 'NICEIC',
      sourceCheckedAt: '2026-01-30T22:13:25.269Z',
      profileUrl:
        'https://tradehand.com/electricians/uk/london/westminster/st-james-s/wc2a/semper-services-limited',
    },
    outputFields: [
      { key: 'id', label: 'ID' },
      { key: 'publicReference', label: 'Public Reference' },
      { key: 'name', label: 'Name' },
      { key: 'trade', label: 'Trade' },
      { key: 'location', label: 'Location' },
      { key: 'claimed', label: 'Claimed by Owner', type: 'boolean' },
      { key: 'sourceRegister', label: 'Source Register' },
      { key: 'sourceCheckedAt', label: 'Source Checked At', type: 'datetime' },
      { key: 'profileUrl', label: 'Profile URL' },
    ],
  },
};
