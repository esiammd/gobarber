import { container } from 'tsyringe';

import type ICacheProvider from './models/ICacheProvider';

import RedisCacheProvider from './implementations/RedisCacheProvider';

const providers = {
  cache: container.resolve(RedisCacheProvider),
};

container.registerInstance<ICacheProvider>('CacheProvider', providers.cache);
