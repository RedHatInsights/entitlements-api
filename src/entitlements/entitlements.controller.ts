import {Request, Response} from "express";
import { userInfo } from "os";
import { hasSmartManagement } from "./subscription.services";

/**
 *
 * @param req Request but using any because req.user creates property does not exist TS type issue
 */
function hasValidAccountNumber(req: any) {
    // if (req.user.account_number > -1) {
    //     return true;
    // }

    return true;
}

export async function getEntitlements(req: any, res: Response) {

    const entitlements = {
        // requires only a valid username/password which is verified before hitting endpoint
        hybrid_cloud: {
            is_entitled: true
        },
        insights: {
            is_entitled: hasValidAccountNumber(req)
        },
        openshift: {
            is_entitled: hasValidAccountNumber(req)
        },
        smart_management: {
            is_entitled: hasSmartManagement(req.user.org_id)
        }
    };

    return res.json(entitlements);
}
