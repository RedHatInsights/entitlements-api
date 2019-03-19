"use strict";

import { start } from "repl";

import fs from "fs";
import _ from "lodash";
import path from "path";
const env = process.env;

/* eslint no-process-env: off */
function parseIntEnv(name: string, defaultValue: number) {
    if (env[name] === undefined) {
        return defaultValue;
    }

    const parsed = parseInt(env[name], 10);

    if (isNaN(parsed)) {
        throw new Error(`invalid value ${name}=${env[name]}`);
    }

    return parsed;
}

const config = {

    bodyParserLimit: env.BODY_PARSER_LIMIT || "100kb",

    // cac: {
    //     host: env.CAC_HOST || env.SSG_HOST || "http://localhost:8090",
    //     impl: env.CAC_IMPL || env.SSG_IMPL
    // },

    cache: {
        revalidationInterval: parseIntEnv("CACHE_REVALIDATION_INVERVAL", 10 * 60), // 10 mins
        ttl: parseIntEnv("CACHE_TTL", 24 * 60 * 60) // 24 hours
    },

    commit: env.OPENSHIFT_BUILD_COMMIT,

    // contentServer: {
    //     auth: env.CONTENT_SERVER_AUTH || null,
    //     host: env.CONTENT_SERVER_HOST || 'http://localhost:8080',
    //     impl: env.CONTENT_SERVER_IMPL,
    //     insecure: (env.CONTENT_SERVER_INSECURE === 'false') ? false : true,
    //     revalidationInterval: parseIntEnv('CONTENT_SERVER_REVALIDATION_INVERVAL', 60 * 60) // 1 hour
    // },

    demo: (env.DEMO_MODE === "true") ? true : false,
    env: env.NODE_ENV || "development",

    // logging: {
    //     level: env.LOG_LEVEL || ((env.NODE_ENV === "test") ? "error" : "debug"),
    //     pretty: (env.NODE_ENV !== "production")
    // },

    metrics: {
        enabled: env.METRICS_ENABLED === "false" ? false : true,
        prefix: env.METRICS_PREFIX || "entitlements_",
        summaryMaxAge: parseIntEnv("METRICS_SUMMARY_MAX_AGE", 10 * 60) // 10 mins
    },

    path: {
        app: env.APP_NAME || "entitlements",
        base: "",
        prefix: env.PATH_PREFIX || "/r/insights/platform"

    },

    port: 8080,

    // general timeout for HTTP invocations of external services
    requestTimeout: parseInt(env.REQUEST_TIMEOUT, 10) || 10000,

    // ssg: {
    //     host: env.SSG_HOST || "http://localhost:8090",
    //     impl: env.SSG_IMPL
    // },

    users: {
        auth: env.USERS_AUTH || "",
        clientId: env.USERS_CLIENT_ID || "entitlements",
        env: env.USERS_ENV || "prod",
        host: env.USERS_HOST || "https://insights-services-pipeline-insights.ext.paas.redhat.com",
        impl: env.USERS_IMPL,
        insecure: (env.USERS_INSECURE === "true") ? true : false,
        revalidationInterval: parseIntEnv("USERS_REVALIDATION_INVERVAL", 60 * 60 * 12) // 12 hours
    },

    // by default enabled in non-prod
    validateResponseStrict: env.VALIDATE_RESPONSE_STRICT === undefined ?
        env.NODE_ENV !== "production" :
        env.VALIDATE_RESPONSE_STRICT === "true" ? true : false

    /*
     * Dependencies
     */

    // redis: {
    //     enabled: env.REDIS_ENABLED === 'true' ? true : false,
    //     host: env.REDIS_HOST || 'localhost',
    //     port: parseIntEnv('REDIS_PORT', 6379),
    //     password: env.REDIS_PASSWORD || undefined
    // }
};

config.path.base = `${config.path.prefix}/${config.path.app}`;

if (fs.existsSync(path.join(__dirname, `${config.env}.js`))) {
    /* tslint:disable-next-line:no-var-requires */
    _.merge(config, require(`./${config.env}`));
}

export = config;
