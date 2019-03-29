import Request from "../../types/RequestType";

const IDENTITY_HEADER = "x-rh-identity";
// const errors = require("../../errors");
// const log = require("../../util/log");

export default function(req: Request, res: Response, next: any) {
    const raw = req.headers[IDENTITY_HEADER];
    const reqId = req.id;

    if (raw === undefined) {
        // log.info({headers: req.headers, reqId}, "rejecting request due to missing identity header");
        // return next(new errors.Unauthorized());
        return next(new Error("Unauthorized"));
    }

    try {
        const value = Buffer.from(raw, "base64").toString("ascii");
        req.identity = JSON.parse(value).identity;
        // tslint:disable-next-line:no-console
        console.log(req.identity);
        // log.trace({identity: req.identity, reqId}, "parsed identity header");

        if (!req.identity.account_number) {
            // return next(new errors.Unauthorized());
            return next(new Error("Unauthorized"));
        }

        if (req.identity.type === "User") {
            req.user = {
                account_number: req.identity.account_number,
                username: req.identity.user.username
            };
        }

        // res.log = res.log.child({req});

        next();
    } catch (e) {
        // log.debug({header: raw, error: e.message, reqId}, "Error decoding identity header");
        // next(new errors.BadRequest("IDENTITY_HEADER", "Invalid identity header"));
        return new Error("Invalid identity header");
    }
}
