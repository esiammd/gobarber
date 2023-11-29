import AppError from '@shared/errors/AppError';
import { type NextFunction, type Request, type Response } from 'express';
import { RateLimiterRedis } from 'rate-limiter-flexible';
import redis from 'redis';

const redisClient = redis.createClient({
  url: process.env.REDIS_URL,
  password: process.env.REDIS_PASS,
});

const limiter = new RateLimiterRedis({
  storeClient: redisClient,
  keyPrefix: 'ratelimit',
  points: 5, // 5 requests
  duration: 1, // per 1 second by IP
});

export default async function rateLimiter(
  request: Request,
  response: Response,
  next: NextFunction,
): Promise<void> {
  try {
    await limiter.consume(request.ip);

    next();
  } catch (err) {
    console.log(err);
    throw new AppError('Too Many Requests', 429);
  }
}
