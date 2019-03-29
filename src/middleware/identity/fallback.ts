"use strict";

import _ from "lodash";
import Request from "../../types/RequestType";
import {createIdentityHeader, IDENTITY_HEADER} from "./utils";

module.exports = (req: Request, res: Response, next: any) => {
    if (_.isUndefined(req.headers[IDENTITY_HEADER])) {
        req.headers[IDENTITY_HEADER] = createIdentityHeader();
    }

    next();
};
