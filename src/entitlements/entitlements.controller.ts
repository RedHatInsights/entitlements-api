import { userInfo } from "os";
import Request from "../types/RequestType";
import Response from "../types/ResponseType";
import { hasSmartManagement } from "./subscription.services";

/**
 *
 * @param req Request but using any because req.user creates property does not exist TS type issue
 */
function hasValidAccountNumber(req: any) {
    if (req.user.account_number > -1) {
        return true;
    }

    return true;
}

/**
 * /v1/entitlements endpoint
 * returns an object with entitlements that have a is_entitled flag as true or false
 *
 * @param req
 * @param res
 */
export async function getEntitlements(req: Request, res: Response) {

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
            is_entitled: hasSmartManagement(req.identity.internal.org_id)
        }
    };

    return res.json(entitlements);
}
