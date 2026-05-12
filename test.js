'use strict';

var assert = require('node:assert/strict');
var Https = require('https');
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

test('supports the documented wc/v3 wp-json base path', function () {
  var api = new WooCommerceAPI({
    url: 'https://yourstore.dev',
    consumerKey: 'ck_XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX',
    consumerSecret: 'cs_XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX',
    wpAPI: true,
    version: 'wc/v3',
  });

  assert.equal(api._getUrl('orders'), 'https://yourstore.dev/wp-json/wc/v3/orders');
});

test('applies the configured port to the host instead of the path', function () {
  var api = new WooCommerceAPI({
    url: 'https://yourstore.dev',
    consumerKey: 'ck_XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX',
    consumerSecret: 'cs_XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX',
    wpAPI: true,
    version: 'wc/v3',
    port: 8443,
  });

  assert.equal(api._getUrl('orders'), 'https://yourstore.dev:8443/wp-json/wc/v3/orders');
});

test('encodes query parameters safely for WooCommerce requests', function () {
  var api = new WooCommerceAPI({
    url: 'https://yourstore.dev',
    consumerKey: 'ck_XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX',
    consumerSecret: 'cs_XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX',
    wpAPI: true,
    version: 'wc/v3',
    queryStringAuth: true,
  });

  assert.equal(
    api._buildRequestUrl(api._getUrl('orders'), [api._serializeQuery({
      'filter[search]': 'blue & green',
      page: 2,
    })]),
    'https://yourstore.dev/wp-json/wc/v3/orders?filter%5Bsearch%5D=blue%20%26%20green&page=2'
  );
});

test('creates an https agent when SSL verification is disabled', function () {
  var api = new WooCommerceAPI({
    url: 'https://yourstore.dev',
    consumerKey: 'ck_XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX',
    consumerSecret: 'cs_XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX',
    wpAPI: true,
    version: 'wc/v3',
    verifySsl: false,
  });

  var agent = api._getAgent();

  assert.ok(agent instanceof Https.Agent);
  assert.equal(agent.options.rejectUnauthorized, false);
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

test('uses basic authentication headers for https stores by default', async function () {
  var api = new WooCommerceAPI({
    url: 'https://yourstore.dev',
    consumerKey: 'ck_XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX',
    consumerSecret: 'cs_XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX',
    wpAPI: true,
    version: 'wc/v3',
  });

  nock.cleanAll();
  nock('https://yourstore.dev', {
    reqheaders: {
      authorization: /^Basic /,
    },
  })
    .get('/wp-json/wc/v3/orders')
    .reply(200, { ok: true });

  var data = await api.get('orders');

  assert.deepEqual(data, { ok: true });
});

test('optionally returns headers with get requests', async function () {
  var api = createApi();

  nock.cleanAll();
  nock('https://yourstore.dev/wp-json/wc/v2')
    .get('/orders' + authQuery)
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

test('preserves OAuth 1.0a query signing for http stores', async function () {
  var api = new WooCommerceAPI({
    url: 'http://yourstore.dev',
    consumerKey: 'ck_XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX',
    consumerSecret: 'cs_XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX',
    wpAPI: true,
    version: 'wc/v3',
  });

  nock.cleanAll();
  nock('http://yourstore.dev')
    .get(function (uri) {
      return (
        uri.indexOf('/wp-json/wc/v3/orders?') === 0 &&
        uri.indexOf('status=completed') !== -1 &&
        uri.indexOf('oauth_consumer_key=ck_XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX') !== -1 &&
        uri.indexOf('oauth_signature_method=HMAC-SHA256') !== -1 &&
        uri.indexOf('oauth_signature=') !== -1
      );
    })
    .reply(200, { ok: true });

  var data = await api.get('orders', { status: 'completed' });

  assert.deepEqual(data, { ok: true });
});

test('encodes http query parameters before OAuth signing', async function () {
  var api = new WooCommerceAPI({
    url: 'http://yourstore.dev',
    consumerKey: 'ck_XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX',
    consumerSecret: 'cs_XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX',
    wpAPI: true,
    version: 'wc/v3',
  });

  nock.cleanAll();
  nock('http://yourstore.dev')
    .get(function (uri) {
      return (
        uri.indexOf('/wp-json/wc/v3/orders?') === 0 &&
        uri.indexOf('filter%5Bsearch%5D=blue%20%26%20green') !== -1 &&
        uri.indexOf('oauth_signature=') !== -1
      );
    })
    .reply(200, { ok: true });

  var data = await api.get('orders', { 'filter[search]': 'blue & green' });

  assert.deepEqual(data, { ok: true });
});

test('supports http delete requests with OAuth parameters', async function () {
  var api = new WooCommerceAPI({
    url: 'http://yourstore.dev',
    consumerKey: 'ck_XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX',
    consumerSecret: 'cs_XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX',
    wpAPI: true,
    version: 'wc/v3',
  });

  nock.cleanAll();
  nock('http://yourstore.dev')
    .delete(function (uri) {
      return (
        uri.indexOf('/wp-json/wc/v3/orders?') === 0 &&
        uri.indexOf('oauth_consumer_key=ck_XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX') !== -1 &&
        uri.indexOf('oauth_signature=') !== -1
      );
    })
    .reply(200, { ok: true });

  var data = await api.delete('orders');

  assert.deepEqual(data, { ok: true });
});
