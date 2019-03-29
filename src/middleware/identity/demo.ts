"use strict";

import Request from "../../types/RequestType";
import {createIdentityHeader, IDENTITY_HEADER} from "./utils";

module.exports = (req: Request, res: Response, next: any) => {
    req.headers[IDENTITY_HEADER] = createIdentityHeader();
    next();
};
