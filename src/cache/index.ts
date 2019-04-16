"use strict";

import P from "bluebird";
import Redis from "ioredis";
import _ from "lodash";
import config from "../config";
import log from "../util/log";

const QUIT_TIMEOUT = 1000;

let client: Redis.Redis = null;

export const connect = () => {
    if (client) {
        return client;
    }

    log.info(`redis ${config.redis.enabled ? "enabled" : "disabled"}`);

    if (!config.redis.enabled) { return; }

    const opts = { retryStrategy: () => 30000 };

    _.merge(opts, config.redis);

    client = new Redis(opts);

    client.on("connect", () => log.info("connected to redis"));
    client.on("error", (err: Error) => {
        log.warn(err, "error connecting to redis");
    });

    return client;
};

export const get = () => {
    if (!client) {
        throw new Error("not connected to redis");
    }

    return client;
};

export const close = () => {
    if (client) {
        const local = client;
        client = null;
        return P.resolve(local.quit())
        .timeout(QUIT_TIMEOUT)
        .catch(P.TimeoutError, () => local.disconnect())
        .finally(() => log.info("redis disconnected"));
    }
};
