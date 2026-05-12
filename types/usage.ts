import WooCommerceAPI from '../index';

const api = new WooCommerceAPI({
  url: 'https://example.com',
  consumerKey: 'ck_test',
  consumerSecret: 'cs_test',
  wpAPI: true,
  version: 'wc/v3',
  queryStringAuth: true,
});

async function validate(): Promise<void> {
  const products = await api.get<{ products: Array<{ id: number }> }>('products');
  products.products.map((product) => product.id);

  const withHeaders = await api.get<{ ok: boolean }>('orders', { header: true });
  withHeaders.header.get('x-wp-total');
  withHeaders.data.ok.valueOf();

  await api.post('orders', { status: 'pending' });
  await api.put('orders/1', { status: 'completed' });
  await api.delete('orders/1');
  await api.options('orders');
}

void validate();
