import request from "request-promise";
import config from "../config";

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
async function getEntitlements(orgId: string) {
    return request({
        // @ts-ignore
        cert: config.subscription.serviceSslCert,
        headers: {
            Accept: "application/json"
        },
        // @ts-ignore
        key: config.subscription.serviceSslKey,
        method: "GET",
        uri: `${config.subscription.dev}${config.subscription.route};
              web_customer_id=${orgId};sku=SVC3124;status=active`
    });
}

/**
 * if getEntitlements returns a subscription then the user is entitled
 *
 * @param orgId org_id from the user object on the request
 */
export function hasSmartManagement(orgId: string) {
    const smartManagementResults = getEntitlements(orgId);
    if (Array.isArray(smartManagementResults) && smartManagementResults.length > 0) {
        return true;
    }

    return false;
}
