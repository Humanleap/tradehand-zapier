const zapier = require('zapier-platform-core');
const App = require('../index');
const { call } = require('../lib/tradehand');

const appTester = zapier.createAppTester(App);
// appTester wraps z.errors.Error messages as JSON; unwrap to the server sentence.
const sentence = (promise) =>
  promise.then(
    () => 'no error',
    (e) => JSON.parse(e.message).message,
  );
const search = (key, inputData) =>
  appTester(App.searches[key].operation.perform, { inputData });

// Static samples may only use keys that a live result also has.
const expectSampleKeysLive = (sample, live) =>
  expect(Object.keys(live)).toEqual(expect.arrayContaining(Object.keys(sample)));

describe('Tradehand', () => {
  test('trade_list pages through every trade', async () => {
    const trades = await appTester(App.triggers.trade_list.operation.perform, {});
    expect(trades.length).toBeGreaterThan(20);
    expect(trades).toContainEqual({ id: 'electrician', name: 'Electricians' });
    expectSampleKeysLive(App.triggers.trade_list.operation.sample, trades[0]);
  });

  test('find_trader by postcode', async () => {
    const [first] = await search('find_trader', {
      trade: 'electrician',
      postcode: 'SW1A 1AA',
    });
    expect(first.id).toBe(first.publicReference);
    expectSampleKeysLive(App.searches.find_trader.operation.sample, first);
  });

  test('find_trader with a blank postcode or town', async () => {
    const byTown = await search('find_trader', {
      trade: 'electrician',
      postcode: '',
      location: 'Winchester',
    });
    const byPostcode = await search('find_trader', {
      trade: 'electrician',
      postcode: 'SW1A 1AA',
      location: '',
    });
    expect(byTown.length).toBeGreaterThan(0);
    expect(byPostcode.length).toBeGreaterThan(0);
  });

  test('find_trader by town', async () => {
    const results = await search('find_trader', {
      trade: 'electrician',
      location: 'Winchester',
    });
    expect(results.length).toBeGreaterThan(0);
  });

  test('find_trader says the server sentence for a bad location', async () => {
    expect(
      await sentence(search('find_trader', { trade: 'electrician', location: 'SO23' })),
    ).toBe('Location "SO23" was not recognised as a UK place');
  });

  test('get_trader', async () => {
    const [trader] = await search('get_trader', {
      publicReference: 'bespoke-gas-ltd-so30',
    });
    expect(trader.name).toBe('Bespoke Gas Ltd');
    expectSampleKeysLive(App.searches.get_trader.operation.sample, trader);
  });

  test('unknown reference finds nothing, and the helper carries the server sentence', async () => {
    expect(await search('get_trader', { publicReference: 'nope-nope' })).toEqual([]);
    expect(
      await search('get_trader_services', { publicReference: 'nope-nope' }),
    ).toEqual([]);
    expect(
      await sentence(
        appTester((z) => call(z, 'get_trader', { publicReference: 'nope-nope' }), {}),
      ),
    ).toBe('That listing is not on the public directory');
  });

  test('get_trader_services', async () => {
    const [result] = await search('get_trader_services', {
      publicReference: 'bespoke-gas-ltd-so30',
    });
    expect(result.services.length).toBeGreaterThan(0);
    expect(result.services[0]).toHaveProperty('name');
    expectSampleKeysLive(App.searches.get_trader_services.operation.sample, result);
  });
});
