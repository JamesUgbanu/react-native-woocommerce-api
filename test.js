'use strict';

var assert = require('node:assert/strict');
var test = require('node:test');
var nock = require('nock');

var WooCommerceAPI = require('./lib/react-native-woocommerce-api.js');
var WooCommerceAPIDefault = require('./lib/react-native-woocommerce-api.js').default;

var authQuery =
  '?consumer_key=ck_XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX&consumer_secret=cs_XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX';

function createApi() {
  return new WooCommerceAPI({
    url: 'https://yourstore.dev',
    consumerKey: 'ck_XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX',
    consumerSecret: 'cs_XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX',
    wpAPI: true,
    version: 'wc/v2',
    queryStringAuth: true,
  });
}

test('constructor throws when required options are missing', function () {
  assert.throws(function () {
    return new WooCommerceAPI();
  }, /required/);
});

test('constructor sets default options', function () {
  var api = createApi();

  assert.equal(api.version, 'wc/v2');
  assert.equal(api.isSsl, true);
  assert.equal(api.verifySsl, true);
  assert.equal(api.encoding, 'utf8');
  assert.equal(api.queryStringAuth, true);
});

test('module exposes a default export alias', function () {
  assert.equal(WooCommerceAPIDefault, WooCommerceAPI);
});

test('builds the default WooCommerce REST API url', function () {
  var api = createApi();

  assert.equal(api._getUrl('products'), 'https://yourstore.dev/wp-json/wc/v2/products');
});

test('builds a custom WordPress REST API prefix', function () {
  var api = new WooCommerceAPI({
    url: 'https://yourstore.dev',
    consumerKey: 'ck_XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX',
    consumerSecret: 'cs_XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX',
    wpAPI: true,
    wpAPIPrefix: 'wp-rest',
    version: 'wc/v2',
    queryStringAuth: true,
  });

  assert.equal(api._getUrl('products'), 'https://yourstore.dev/wp-rest/wc/v2/products');
});

test('returns content for post requests', async function () {
  var api = createApi();

  nock.cleanAll();
  nock('https://yourstore.dev/wp-json/wc/v2')
    .post('/orders' + authQuery, {})
    .reply(200, { ok: true });

  var data = await api.post('orders', {});

  assert.deepEqual(data, { ok: true });
});

test('returns content for get requests', async function () {
  var api = createApi();

  nock.cleanAll();
  nock('https://yourstore.dev/wp-json/wc/v2')
    .get('/orders' + authQuery)
    .reply(200, { ok: true });

  var data = await api.get('orders');

  assert.deepEqual(data, { ok: true });
});

test('optionally returns headers with get requests', async function () {
  var api = createApi();

  nock.cleanAll();
  nock('https://yourstore.dev/wp-json/wc/v2')
    .get('/orders' + authQuery + '&header=true')
    .reply(200, { ok: true }, { 'x-wp-total': '15' });

  var result = await api.get('orders', { header: true });

  assert.deepEqual(result.data, { ok: true });
  assert.equal(result.header.get('x-wp-total'), '15');
});

test('returns content for put requests', async function () {
  var api = createApi();

  nock.cleanAll();
  nock('https://yourstore.dev/wp-json/wc/v2')
    .put('/orders' + authQuery, {})
    .reply(200, { ok: true });

  var data = await api.put('orders', {});

  assert.deepEqual(data, { ok: true });
});

test('returns content for delete requests', async function () {
  var api = createApi();

  nock.cleanAll();
  nock('https://yourstore.dev/wp-json/wc/v2')
    .delete('/orders' + authQuery)
    .reply(200, { ok: true });

  var data = await api.delete('orders');

  assert.deepEqual(data, { ok: true });
});
