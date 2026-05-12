# react-native-woocommerce-api

Lightweight WooCommerce REST API client for React Native and JavaScript applications.

## Installation

```bash
npm install react-native-woocommerce-api
```

## JavaScript usage

### CommonJS

```js
const WooCommerceAPI = require('react-native-woocommerce-api');

const api = new WooCommerceAPI({
  url: 'https://yourstore.com',
  consumerKey: 'ck_xxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
  consumerSecret: 'cs_xxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
  wpAPI: true,
  version: 'wc/v3',
  queryStringAuth: true,
});
```

### ESM-style import

```js
import WooCommerceAPI from 'react-native-woocommerce-api';

const api = new WooCommerceAPI({
  url: 'https://yourstore.com',
  consumerKey: 'ck_xxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
  consumerSecret: 'cs_xxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
  wpAPI: true,
  version: 'wc/v3',
  queryStringAuth: true,
});
```

### Requests

```js
api.get('products')
  .then((data) => {
    console.log(data);
  })
  .catch((error) => {
    console.error(error);
  });
```

```js
api.get('orders', { customer: 123, per_page: 100 })
  .then((data) => {
    console.log(data);
  });
```

```js
api.post('products', {
  product: {
    title: 'Premium Quality',
    type: 'simple',
    regular_price: '21.99',
  },
});
```

```js
api.put('orders/123', {
  order: {
    status: 'completed',
  },
});
```

```js
api.delete('coupons/123');
```

### Returning headers with GET requests

```js
api.get('orders', { header: true }).then(({ header, data }) => {
  console.log(header.get('x-wp-total'));
  console.log(data);
});
```

## TypeScript usage

The package now ships with built-in type declarations.

```ts
import WooCommerceAPI from 'react-native-woocommerce-api';

type ProductList = {
  products: Array<{ id: number; name: string }>;
};

const api = new WooCommerceAPI({
  url: 'https://yourstore.com',
  consumerKey: 'ck_xxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
  consumerSecret: 'cs_xxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
  wpAPI: true,
  version: 'wc/v3',
  queryStringAuth: true,
});

async function loadProducts(): Promise<void> {
  const data = await api.get<ProductList>('products');
  console.log(data.products[0]?.name);
}
```

## API notes

- `url`, `consumerKey`, and `consumerSecret` are required.
- Existing public method names remain unchanged: `get`, `post`, `put`, `delete`, and `options`.
- CommonJS usage continues to work.
