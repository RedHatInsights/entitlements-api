"use strict";

import Request from "../../types/RequestType";

// const errors = require("../../errors");

export default function(req: Request, res: Response, next: any) {
    if (req.identity.type !== "User" || !req.identity.user.username || req.identity.user.is_internal === undefined) {
        // return next(new errors.Forbidden());
        return new Error("Forbidden");
    }

    next();
}
