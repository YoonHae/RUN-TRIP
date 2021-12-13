const redis = require('redis');

class RedisManager {
    constructor (primary_host, base_host=primary_host) {        
        this.writeClient = redis.createClient(primary_host);
        this.readClient = redis.createClient(base_host);
        this.name = "RedisManager";
    }

    async connect() {
        this.writeClient.on('error', (err) => console.error('Redis Write Client', err));
        this.readClient.on('error', (err) => console.error('Redis Read Client', err));

        return Promise.all([this.writeClient.connect(), this.readClient.connect()]);
        //return Promise.all([this.writeClient.connect()]);
    }

    async get(key, ttl=0) {
        if (ttl > 0) {
            this.writeClient.expire(key, ttl);
        }
        let res = await this.readClient.get(key);
        //let res = await this.writeClient.get(key);
        return res;
    }

    async set(key, value, ttl=0) {
        let options = {
            NX: true
        }
        if (ttl > 0) {
            options.EX = ttl;
        } 
        await this.writeClient.set(key, value, options);
    }

    async del(key) {
        return await this.writeClient.del(key);
    }

    quit() {
        this.writeClient.quit();
        this.readClient.quit();
    }
}

module.exports = RedisManager;