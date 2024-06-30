const redis = require('redis');
const { promisify } = require('util');

class RedisClient {
  constructor() {
    this.client = redis.createClient();

    // Promisify Redis client methods
    this.getAsync = promisify(this.client.get).bind(this.client);
    this.setAsync = promisify(this.client.set).bind(this.client);
    this.delAsync = promisify(this.client.del).bind(this.client);

    // Error handling
    this.client.on('error', (error) => {
      console.error(`Redis client error: ${error}`);
    });
  }

  // Check if Redis client is connected
  isAlive() {
    return this.client.connected;
  }

  // Async function to get a value from Redis
  async get(key) {
    try {
      const value = await this.getAsync(key);
      return value;
    } catch (error) {
      console.error(`Error retrieving key '${key}' from Redis: ${error}`);
      return null;
    }
  }

  // Async function to set a key-value pair with an optional expiration (in seconds)
  async set(key, value, duration) {
    try {
      await this.setAsync(key, value);
      if (duration) {
        await this.client.expire(key, duration);
      }
    } catch (error) {
      console.error(`Error setting key '${key}' in Redis: ${error}`);
    }
  }

  // Async function to delete a key from Redis
  async del(key) {
    try {
      await this.delAsync(key);
    } catch (error) {
      console.error(`Error deleting key '${key}' from Redis: ${error}`);
    }
  }

  // Close Redis connection
  quit() {
    this.client.quit();
  }
}

const redisClient = new RedisClient();

module.exports = redisClient;
