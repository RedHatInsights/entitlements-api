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
    backendUrl: "",

    bodyParserLimit: env.BODY_PARSER_LIMIT || "100kb",

    cache: {
        revalidationInterval: parseIntEnv("CACHE_REVALIDATION_INVERVAL", 10 * 60), // 10 mins
        ttl: parseIntEnv("CACHE_TTL", 24 * 60 * 60) // 24 hours
    },

    commit: env.OPENSHIFT_BUILD_COMMIT,

    demo: (env.DEMO_MODE === "true") ? true : false,
    env: env.NODE_ENV || "development",

    logging: {
        level: env.LOG_LEVEL || ((env.NODE_ENV === "test") ? "error" : "debug"),
        pretty: (env.NODE_ENV !== "production")
    },

    metrics: {
        enabled: env.METRICS_ENABLED === "false" ? false : true,
        prefix: env.METRICS_PREFIX || "entitlements_",
        summaryMaxAge: parseIntEnv("METRICS_SUMMARY_MAX_AGE", 10 * 60) // 10 mins
    },

    path: {
        app: env.APP_NAME || "entitlements",
        base: "",
        prefix: env.PATH_PREFIX || "/api"

    },

    port: 8080,

    // general timeout for HTTP invocations of external services
    requestTimeout: parseInt(env.REQUEST_TIMEOUT, 10) || 10000,

    // needs to support dev, ci, qa, prod environments
    // We are not entitled to smart-management in subscription.dev.api, so use qa instead.
    // subscription
    subscription: {
        dev: "https://subscription.qa.api.redhat.com",
        prod: "https://subscription.api.redhat.com",
        qa: "https://subscription.qa.api.redhat.com",
        route: "/svcrest/subscription/v5/search/criteria;web_customer_id=${orgId};sku=SVC3124;status=active",

        // @ts-ignore
        serviceSslCa: (process.env.SERVICE_SSL_CA || "").replace(/\\n/g, "\n"),
        // @ts-ignore
        serviceSslCert: (process.env.SERVICE_SSL_CERT || "").replace(/\\n/g, "\n"),
        // @ts-ignore
        serviceSslKey: (process.env.SERVICE_SSL_KEY || "").replace(/\\n/g, "\n")
    },

    users: {
        auth: env.USERS_AUTH || "",
        clientId: env.USERS_CLIENT_ID || "entitlements",
        env: env.USERS_ENV || "prod",
        host: env.USERS_HOST || "https://insights-services-pipeline-insights.ext.paas.redhat.com",
        impl: env.USERS_IMPL,
        insecure: (env.USERS_INSECURE === "true") ? true : false,
        revalidationInterval: parseIntEnv("USERS_REVALIDATION_INVERVAL", 60 * 60 * 12) // 12 hours
    },

    redis: {
        enabled: env.REDIS_ENABLED === "true" ? true : false,
        host: env.REDIS_HOST || "localhost",
        password: env.REDIS_PASSWORD || undefined,
        port: parseIntEnv("REDIS_PORT", 6379)
    },

    // by default enabled in non-prod
    validateResponseStrict: env.VALIDATE_RESPONSE_STRICT === undefined ?
        env.NODE_ENV !== "production" :
        env.VALIDATE_RESPONSE_STRICT === "true" ? true : false
};

config.backendUrl = config.subscription.qa;
if (process.env.BACKEND_ENV && process.env.BACKEND_ENV === "prod") {
    config.backendUrl = config.subscription.prod;
}

config.path.base = `${config.path.prefix}/${config.path.app}`;

if (fs.existsSync(path.join(__dirname, `${config.env}.js`))) {
    /* tslint:disable-next-line:no-var-requires */
    _.merge(config, require(`./${config.env}`));
}

export = config;
