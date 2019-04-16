"use strict";

import _ from "lodash";
import cache from "../cache";
import log from "../util/log";
import config from "../config";

const CACHE_TTL = config.cache.ttl;
const REVALIDATION_INTERVAL = config.cache.revalidationInterval;

function doHttp (options, cached) {
    const opts = {
        resolveWithFullResponse: true,
        simple: false,
        ...options
    };

    if (_.get(cached, 'etag.length') > 0) {
        opts.headers = opts.headers || {};
        opts.headers['if-none-match'] = cached.etag;
    }

    return request.run(opts)
    .then(res => {
        switch (res.statusCode) {
            case 200:
            case 304: return res;
            case 404: return null;
        }
    });
}

function cacheKey (uri) {
    return `entitlements|http-cache|${uri}`;
}

async function loadCachedEntry (redis, key, revalidationInterval) {
    let cached = await redis.get(key);

    if (!cached) { return; }

    cached = JSON.parse(cached);
    cached.time = new Date(cached.time);
    cached.expired = new Date() - cached.time > revalidationInterval * 1000;
    return cached;
}

function saveCachedEntry (redis, key, etag, body) {
    redis.setex(key, CACHE_TTL, JSON.stringify({
        etag,
        time: new Date().toISOString(),
        body
    }));
}

async function run (options, useCache = false) {
    if (!useCache || !config.redis.enabled || cache.get().status !== 'ready') {
        return doHttp(options, false, metrics).then(res => (res === null ? null : res.body));
    }

    const uri = notNil(options.uri);
    const key = useCache.key || cacheKey(uri);
    const revalidationInterval = useCache.revalidationInterval || REVALIDATION_INTERVAL; // seconds

    const cached = await loadCachedEntry(cache.get(), key, revalidationInterval);

    // TODO: logs

    const res = await doHttp(options, cached);

    // 404
    if (!res) {
        if (cached) { cache.get().del(key); }
        return null;
    }

    // 304
    if (res.statusCode === 304) {
        log.trace({key}, 'revalidated');
        saveCachedEntry(cache.get(), key, cached.etag, cached.body);
        return cached.body;
    }

    if (useCache.cacheable && res.body && !useCache.cacheable(res.body)) {
        log.trace({key}, 'not cacheable');
        return res.body;
    }

    log.trace({key}, 'saved to cache');
    saveCachedEntry(cache.get(), key, res.headers.etag, res.body);
    return res.body;
}

module.exports.request = run;