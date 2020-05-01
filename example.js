var WooCommerceAPI = require('react-native-woocommerce-api');

var WooCommerceAPI = new WooCommerceAPI({
  url: 'https://yourstore.com', // Your store URL
  ssl: true,
  consumerKey: 'ck_xxxxxxxxxxxxxxxxxxxxxxxxxxxxx', // Your consumer secret
  consumerSecret: 'cs_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx', // Your consumer secret
  wpAPI: true, // Enable the WP REST API integration
  version: 'wc/v2', // WooCommerce WP REST API version
  queryStringAuth: true
});

 	// GET example
WooCommerceAPI.get('customers', function(err, data, res) {
  console.log(res);
});

// POST example
// WooCommerceAPI.post('products', {
//   product: {
//     title: 'Premium Quality',
//     type: 'simple',
//     regular_price: '21.99'
//   }
// }, function(err, data, res) {
//   console.log(res);
// });

// PUT example
// WooCommerceAPI.put('orders/123', {
//   order: {
//     status: 'completed'
//   }
// }, function(err, data, res) {
//   console.log(res);
// });

// Delete example
// WooCommerceAPI.delete('coupons/123', function(err, data, res) {
//   console.log(res);
// });