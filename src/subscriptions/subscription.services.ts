import fs from "fs";
import LRU from "lru-cache";
import request from "request-promise";

import config from "../config";
import Request from "../types/RequestType";
import log from "../util/log";

const cache = new LRU({
    max: 500,
    maxAge: 1000 * 60 * 30
});

/**
 * Queries subscription service looking for supplied smart management
 * sku for given org_id to see if user is entitled to see smart management
 *
 * Will return an Array with one object with details about the smart management
 * subscription if user is entitled, else will return an empty Array
 *
 * @param orgId org_id from the user object on the request. Subscription service
 * refers to this as the web_customer_id
 */
async function getEntitlements(req: Request) {
    let ca = config.subscription.serviceSslCa;
    let cert = config.subscription.serviceSslCert;
    let key = config.subscription.serviceSslKey;

    if (process.env.NODE_ENV === "development") {
        cert = fs.readFileSync(cert, "utf8").replace(/\\n/g, "\n");
        key = fs.readFileSync(key, "utf8").replace(/\\n/g, "\n");
        ca = fs.readFileSync(ca, "utf8").replace(/\\n/g, "\n");
    }

    return request({
        // @ts-ignore
        ca,
        // @ts-ignore
        cert,
        headers: {
            Accept: "application/json"
        },
        json: true,
        // @ts-ignore
        key,
        method: "GET",
        // @ts-ignore
        uri: `${config.backendUrl}${config.subscription.route}`.replace("${orgId}", req.identity.internal.org_id)
    });
}

function getTimerString(time: number, identity: object, cacheHit: boolean) {
    const obj = {
        cacheHit,
        // @ts-ignore
        org_id: identity.internal.org_id,
        time
    };

    // @ts-ignore
    if (identity.type === "User") {
        // @ts-ignore
        obj.user = identity.user.username;
    }

    return JSON.stringify(obj);
}

function logTimeSpent(start: number, identity: object, cacheHit: boolean) {
    const end = Date.now();
    log.info(getTimerString(end - start, identity, cacheHit));
}

/**
 * if getEntitlements returns a subscription then the user is entitled
 *
 * @param orgId org_id from the user object on the request
 */
export async function hasSmartManagement(req: Request) {
    try {
        const start = Date.now();
        const cacheValue: any = cache.get(req.identity.internal.org_id);

        if (cacheValue === true || cacheValue === false) {
            logTimeSpent(start, req.identity, true);
            return cacheValue;
        }

        const response: any = await getEntitlements(req);
        logTimeSpent(start, req.identity, false);

        if ((Array.isArray(response) && response.length > 0) || response.subscriptionNumber) {
            cache.set(req.identity.internal.org_id, true);
            return true;
        }

    } catch (e) {
        log.error("Error while running getEntitlements");

        if (e.name === "StatusCodeError") {
            log.error(`${e.name} [${e.statusCode}] """ ${e.message} """`);
            return false;
        }

        // for extra safety
        // we dont want certs in the logs
        // or very large response data
        delete e.options;
        delete e.response;

        log.error(e);
        return false;
    }

    cache.set(req.identity.internal.org_id, false);
    return false;
}
