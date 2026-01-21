export type Protocol = 'http' | 'https';

export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE' | 'HEAD' | 'OPTIONS';

export type LoadType = 'linear' | 'incremental' | 'waved';

export interface TestOptions {
  target: string;
  protocol: Protocol;
  method: HttpMethod;
  duration: number;
  requestCount: number;
  loadType: LoadType;
  timeout: number;
  body: string;
  debug: boolean;
  basicAuth: {
    enabled: boolean;
    username: string;
    password: string;
  };
  proxy: {
    enabled: boolean;
    url: string;
  };
}

export interface Header {
  id: string;
  key: string;
  value: string;
}

export const DEFAULT_OPTIONS: TestOptions = {
  target: '',
  protocol: 'https',
  method: 'GET',
  duration: 10,
  requestCount: 100,
  loadType: 'linear',
  timeout: 5,
  body: '',
  debug: false,
  basicAuth: {
    enabled: false,
    username: '',
    password: '',
  },
  proxy: {
    enabled: false,
    url: '',
  },
};

export const DEFAULT_HEADER: Header = {
  id: crypto.randomUUID(),
  key: 'User-Agent',
  value: 'DdosifyDockerExtension/0.2.0',
};
