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

## Development

Install dependencies:

```bash
npm install
```

Available scripts:

```bash
npm run build
npm run test
npm run test:coverage
npm run typecheck
npm run audit
```

## Release and publishing

Publishing is handled through GitHub Actions.

The npm publish workflow runs only when:

- a GitHub Release is published, or
- a tag matching `v*` is pushed

Before publish, the workflow will:

1. run `npm ci`
2. run lint
3. run type checking
4. run tests
5. run the build script
6. publish to npm with provenance enabled

### GitHub Actions requirements

Add this repository secret before publishing:

- `NPM_TOKEN`: npm automation token with permission to publish the package

No tokens are hardcoded in the repository.

## Security notes

This package has been modernized to reduce dependency risk:

- vulnerable direct dependencies were upgraded
- legacy lint and coverage tooling with insecure transitive dependencies were removed
- the lockfile was regenerated against current package metadata

The goal of the update was to improve security without changing the public API surface.
