"use strict";

import _ from "lodash";
import * as cache from "../cache";
import config from "../config";
import Request from "../types/RequestType";
import log from "../util/log";
import { notNil } from "../util/preconditions";

const CACHE_TTL = config.cache.ttl;
const REVALIDATION_INTERVAL = config.cache.revalidationInterval;

function doHttp(options: any, cached: any, req: Request) {

    const opts = {
        resolveWithFullResponse: true,
        simple: false,
        ...options
    };

    if (_.get(cached, "etag.length") > 0) {
        opts.headers = opts.headers || {};
        opts.headers["if-none-match"] = cached.etag;
    }

    return req.run(opts)
    .then((res: any) => {
        switch (res.statusCode) {
            case 200:
            case 304: return res;
            case 404: return null;
        }
    });
}

function cacheKey(uri: string) {
    log.info(uri);
    return `entitlements|http-cache|${uri}`;
}

async function loadCachedEntry(redis: { get: (arg0: any) => any; }, key: any, revalidationInterval: number) {
    let cached = await redis.get(key);

    if (!cached) { return; }

    cached = JSON.parse(cached);
    cached.time = +new Date(cached.time);
    cached.expired = +new Date() - cached.time > revalidationInterval * 1000;

    log.info(cached);
    return cached;
}

function saveCachedEntry(
    redis: { setex: (arg0: any, arg1: number, arg2: string) => {}; },
    key: any, etag: any, body: any) {
        redis.setex(key, CACHE_TTL, JSON.stringify({
            body,
            etag,
            time: new Date().toISOString()
        }));
}

export async function run(options: any, useCache: any = false, req: Request) {
    if (!useCache || !config.redis.enabled || cache.get().status !== "ready") {
        // tslint:disable-next-line: no-shadowed-variable
        return doHttp(options, false, req).then((res: Response) => (res === null ? null : res.body));
    }

    const uri = notNil(options.uri);
    const key = useCache.key || cacheKey(uri);
    const revalidationInterval = useCache.revalidationInterval || REVALIDATION_INTERVAL; // seconds

    const cached = await loadCachedEntry(cache.get(), key, revalidationInterval);

    // TODO: logs

    const res = await doHttp(options, cached, req);

    // 404
    if (!res) {
        if (cached) { cache.get().del(key); }
        return null;
    }

    // 304
    if (res.statusCode === 304) {
        log.trace({key}, "revalidated");
        saveCachedEntry(cache.get(), key, cached.etag, cached.body);
        return cached.body;
    }

    if (useCache.cacheable && res.body && !useCache.cacheable(res.body)) {
        log.trace({key}, "not cacheable");
        return res.body;
    }

    log.trace({key}, "saved to cache");
    saveCachedEntry(cache.get(), key, res.headers.etag, res.body);
    return res.body;
}

module.exports.req = run;
