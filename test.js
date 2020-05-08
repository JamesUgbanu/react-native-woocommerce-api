var WooCommerceAPI = require('./lib/react-native-woocommerce-api.js');
var chai = require('chai');
var nock = require('nock');

var url = '?consumer_key=ck_XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX&consumer_secret=cs_XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX';
describe('#Construct', function() {
    it('should throw an error if the url, consumerKey or consumerSecret are missing', function() {
      chai.expect(function() {
        new WooCommerceAPI();
      }).to.throw(Error);
    });
  
    it('should set the default options', function() {
      const api = new WooCommerceAPI({
        url: 'https://yourstore.dev',
        consumerKey: 'ck_XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX',
        consumerSecret: 'cs_XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX',
        wpAPI: true,
        version: 'wc/v2',
        queryStringAuth: true
      });
  
      chai.expect(api.version).to.equal('wc/v2');
      chai.expect(api.isSsl).to.be.true;
      chai.expect(api.verifySsl).to.be.true;
      chai.expect(api.encoding).to.equal('utf8');
      chai.expect(api.queryStringAuth).to.equal(true);
    });
  });
  
  describe('#Requests', function() {
    beforeEach(function() {
      nock.cleanAll();
    });
  
    var api = new WooCommerceAPI({
      url: 'https://yourstore.dev',
      consumerKey: 'ck_XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX',
      consumerSecret: 'cs_XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX',
      wpAPI: true,
      version: 'wc/v2',
      queryStringAuth: true
    });
  
    it('should return full API url', function() {
      var endpoint = 'products';
      var expected = 'https://yourstore.dev/wp-json/wc/v2/products';
      var url      = api._getUrl(endpoint);
  
      chai.assert.equal(url, expected);
    });
  
    it('should return full WP REST API url with a custom path', function() {
      var restApi = new WooCommerceAPI({
        url: 'https://yourstore.dev',
        consumerKey: 'ck_XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX',
        consumerSecret: 'cs_XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX',
        wpAPI: true,
        wpAPIPrefix: 'wp-rest',
        version: 'wc/v2',
        queryStringAuth: true
      });
  
      var endpoint = 'products';
      var expected = 'https://yourstore.dev/wp-rest/wc/v2/products';
      var url      = restApi._getUrl(endpoint);
  
      chai.assert.equal(url, expected);
    });
  
    it('should return content for basic auth', function(done) {
      nock('https://yourstore.dev/wp-json/wc/v2')
      .post('/orders'+url, {}).reply(200, {
        ok: true
      });
      api.post('orders', {})
      .then(data => {
          chai.expect(data).be.a.string;
          done();
      });
      //.catch(err => chai.expect(err).to.not.exist)
    });
  
    it('should return content for get requests', function(done) {
      nock('https://yourstore.dev/wp-json/wc/v2')
      .get('/orders'+url).reply(200, {
        ok: true
      });
  
      api.get('orders')
      .then(data => {
        chai.expect(data).be.a.string;
        done();
    });
    });
  
    it('should return content for put requests', function(done) {
      nock('https://yourstore.dev/wp-json/wc/v2')
      .put('/orders'+url, {}).reply(200, {
        ok: true
      });
  
      api.put('orders', {})
      .then(data => {
        chai.expect(data).be.a.string;
        done();
    });
    });
  
    it('should return content for delete requests', function(done) {
      nock('https://yourstore.dev/wp-json/wc/v2')
      .delete('/orders'+url).reply(200, {
        ok: true
      });
  
      api.delete('orders')
      .then(data => {
        chai.expect(data).be.a.string;
        done();
    });
    });
  
    // it('should return content for options requests', function(done) {
    //   nock('https://yourstore.dev/wp-json/wc/v2')
    //   .intercept('/orders'+url, 'OPTIONS').reply(400);
  
    //   api.options('orders')
    //   .then(data => {
    //     chai.expect(data).be.a.string;
    //     done();
    // })
    // .catch(err => {
    //     console.log(err);
    //     chai.expect(err).to.not.exist;
    //     done();
    // });
    // });
  });