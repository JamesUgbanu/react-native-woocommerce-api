import WooCommerceAPI from 'react-native-woocommerce-api';

const Woocommerce = new WooCommerceAPI({
  url: 'https://yourstore.com', // Your store URL
  ssl: true,
  consumerKey: 'ck_xxxxxxxxxxxxxxxxxxxxxxxxxxxxx', // Your consumer secret
  consumerSecret: 'cs_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx', // Your consumer secret
  wpAPI: true, // Enable the WP REST API integration
  version: 'wc/v3', // WooCommerce WP REST API version
  queryStringAuth: true
});

Woocommerce.get('products')
          .then(data => {
          	console.log(data);
          })
          .catch(error => {
          	console.log(error);
          });
