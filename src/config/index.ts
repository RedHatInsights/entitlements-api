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

    cache: {
        revalidationInterval: parseIntEnv("CACHE_REVALIDATION_INVERVAL", 10 * 60), // 10 mins
        ttl: parseIntEnv("CACHE_TTL", 24 * 60 * 60) // 24 hours
    },

    commit: env.OPENSHIFT_BUILD_COMMIT,

    demo: (env.DEMO_MODE === "true") ? true : false,
    env: env.NODE_ENV || "development",

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
};

config.path.base = `${config.path.prefix}/${config.path.app}`;

if (fs.existsSync(path.join(__dirname, `${config.env}.js`))) {
    /* tslint:disable-next-line:no-var-requires */
    _.merge(config, require(`./${config.env}`));
}

export = config;
