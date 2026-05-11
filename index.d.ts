export interface WooCommerceHeaders {
  get(name: string): string | null;
  forEach(
    callback: (value: string, key: string, parent: WooCommerceHeaders) => void
  ): void;
}

export interface WooCommerceGetResponse<T = unknown> {
  header: WooCommerceHeaders;
  data: T;
}

export interface WooCommerceRequestParams {
  [key: string]: unknown;
}

export interface WooCommerceGetParams extends WooCommerceRequestParams {
  header?: boolean;
}

export interface WooCommerceOptions {
  url: string;
  consumerKey: string;
  consumerSecret: string;
  wpAPI?: boolean;
  wpAPIPrefix?: string;
  version?: string;
  verifySsl?: boolean;
  encoding?: string;
  queryStringAuth?: boolean;
  port?: string | number;
  timeout?: number;
}

declare class WooCommerceAPI {
  constructor(options: WooCommerceOptions);

  get<T = unknown>(endpoint: string, data: WooCommerceGetParams & { header: true }): Promise<WooCommerceGetResponse<T>>;
  get<T = unknown>(endpoint: string, data?: WooCommerceGetParams): Promise<T>;
  post<T = unknown>(endpoint: string, data?: WooCommerceRequestParams): Promise<T>;
  put<T = unknown>(endpoint: string, data?: WooCommerceRequestParams): Promise<T>;
  delete<T = unknown>(endpoint: string): Promise<T>;
  options<T = unknown>(endpoint: string): Promise<T>;
}

export default WooCommerceAPI;
