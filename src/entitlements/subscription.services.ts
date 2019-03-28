"use strict";

import { Request, Response } from "express";
import request from "request-promise";
import config from "../config";

function buildUri(userId: string) {
    return [
        `${config.subscription.dev}${config.subscription.route}`,
        `web_customer_id=${userId}`,
        "ku=SVC3124",
        "status=active"
    ].join(";");
}

async function getEntitlements(userId: string) {
    return request({
        // @ts-ignore
        cert: config.subscription.serviceSslCert,
        headers: {
            Accept: "application/json"
        },
        // @ts-ignore
        key: config.subscription.serviceSslKey,
        method: "GET",
        uri: buildUri(userId)
    });
}

export function hasSmartManagement(accountNumber: string) {
    const smartManagementResults = getEntitlements(accountNumber);
    if (Array.isArray(smartManagementResults) && smartManagementResults.length > 0) {
        return true;
    }

    return false;
}
