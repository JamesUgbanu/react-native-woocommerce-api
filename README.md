![GitHub package.json version](https://img.shields.io/github/package-json/v/techneplus/react-native-woocommerce-api.svg) [![Build Status](https://travis-ci.org/JamesUgbanu/react-native-woocommerce-api.svg?branch=master)](https://travis-ci.org/JamesUgbanu/react-native-woocommerce-api)

# react-native-woocommerce-api
A wrappper that connects react Native to the WooCommerce API

## Installation

To install the module using NPM:

```
npm install react-native-woocommerce-api --save
```

## Setup

You will need a consumer key and consumer secret to call your store's WooCommerce API. You can find instructions [here](https://docs.woocommerce.com/document/woocommerce-rest-api/)

Include the 'react-native-woocommerce-api' module within your script and instantiate it with a config:

```javascript
import WooCommerceAPI from 'react-native-woocommerce-api';

const WooCommerceAPI = new WooCommerceAPI({
  url: 'https://yourstore.com', // Your store URL
  ssl: true,
  consumerKey: 'ck_xxxxxxxxxxxxxxxxxxxxxxxxxxxxx', // Your consumer secret
  consumerSecret: 'cs_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx', // Your consumer secret
  wpAPI: true, // Enable the WP REST API integration
  version: 'wc/v3', // WooCommerce WP REST API version
  queryStringAuth: true
});
```

**Instantiating a WooCommerceAPI instance without a url, consumerKey or secret will result in an error being thrown**

## Calling the API

Your WooCommerce API can be called once the WooCommerceAPI object has been instantiated (see above).

### GET

```javascript
WooCommerceAPI.get('products')
          .then(data => {
          	console.log(data);
          })
          .catch(error => {
          	console.log(error);
          });
```

### GET WITH PARAMETER

```javascript
WooCommerceAPI.get('orders', { customer: userID, per_page: 100 })
          .then(data => {
          	console.log(data);
          })
          .catch(error => {
          	console.log(error);
          });
```

### POST

For this example you have a [Order object](http://woocommerce.github.io/woocommerce-rest-api-docs/#create-an-order).

```javascript
WooCommerceAPI.post('products', {
  product: {
    title: 'Premium Quality',
    type: 'simple',
    regular_price: '21.99'
    }
  })
  .then(data => {
          	console.log(data);
          })
  .catch(error => {
          	console.log(error);
          });
```

### PUT

```javascript
WooCommerceAPI.put('orders/123', {
  order: {
    status: 'completed'
  }
  })
  .then(data => {
          	console.log(data);
          })
  .catch(error => {
          	console.log(error);
          });
```

### DELETE

```javascript
WooCommerceAPI.delete('coupons/123')
.then(data => {
          	console.log(data);
          })
  .catch(error => {
          	console.log(error);
          });
});
```

## Testing

```
npm test
```
