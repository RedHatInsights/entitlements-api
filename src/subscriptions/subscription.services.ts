import request from "request-promise";
import config from "../config";
import Request from "../types/RequestType";
import subscriptionUrl from "./subscriptionUrl";

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
    return request({
        // @ts-ignore
        ca: config.subscription.serviceSslCa,
        // @ts-ignore
        cert: config.subscription.serviceSslCert,
        headers: {
            Accept: "application/json"
        },
        json: true,
        // @ts-ignore
        key: config.subscription.serviceSslKey,
        method: "GET",
        // @ts-ignore
        uri: `${subscriptionUrl(req)}${config.subscription.route}`.replace("${orgId}", req.identity.internal.org_id)
    });
}

/**
 * if getEntitlements returns a subscription then the user is entitled
 *
 * @param orgId org_id from the user object on the request
 */
export async function hasSmartManagement(req: Request) {
    const response = await getEntitlements(req);
    if ((Array.isArray(response) && response.length > 0) || response.subscriptionNumber) {
        return true;
    }

    return false;
}
