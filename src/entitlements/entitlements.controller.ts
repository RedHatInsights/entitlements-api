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

    return false;
}

export async function getEntitlements(req: any, res: Response) {

    const entitlements = {
        // requires only a valid username/password which is verified before hitting endpoint
        hybridCloud: {
            isEntitled: true
        },
        insights: {
            isEntitled: hasValidAccountNumber(req)
        },
        openShift: {
            isEntitled: hasValidAccountNumber(req)
        },
        smartManagement: {
            isEntitled: hasSmartManagement("114034")
            // isEntitled: hasSmartManagement(req)
        }
    };

    return res.json(entitlements);
}
