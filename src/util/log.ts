"use strict";

import _ from "lodash";
import pino from "pino";
import config from "../config";
import {getReq} from "./cls";

// avoid writting down the entire response buffer
function errorSerializer(e: any) {
    if (!e) {
        return e;
    }

    const result =  _.omit(pino.stdSerializers.err(e), ["originalResponse"]);
    result.options = optionsSerialized(result.options);
    result.cause = errorSerializer(result.cause);

    return result;
}

function optionsSerialized(options: any) {
    if (!options) {
        return options;
    }

    return _.omit(options, ["ca", "cert"]);
}

function headersSerializer(headers: any) {
    if (!headers) {
        return headers;
    }

    return _.omit(headers, ["cookie"]);
}

const serializers = {
    cause: errorSerializer,
    err: errorSerializer,
    options: optionsSerialized,
    req: (value: any) => {
        const result = pino.stdSerializers.req(value);
        // @ts-ignore
        result.identity = value.raw.identity;
        result.headers = headersSerializer(result.headers);
        return result;
    }
};

const logger = pino({
    level: config.logging.level,
    name: "entitlements",
    prettyPrint: config.logging.pretty ? {
        errorProps: "*"
    } : false
});

function getLogger(): pino.Logger {
    const req = getReq();

    if (!req) {
        return logger; // outside of request, fallback to default logger
    }

    if (!req.logger) {
        req.logger = logger.child({reqId: req.id});
    }

    return req.logger;
}

export default new Proxy (logger, {
    get(target, key, receiver) {
        const theLogger = getLogger();

        const result = Reflect.get(theLogger, key, receiver);
        if (typeof result === "function") {
            return result.bind(theLogger); // bind so that we do not proxy inner calls
        }

        return result;
    }
});

module.exports.serializers = serializers;
