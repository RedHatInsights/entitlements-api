import Request from "../../types/RequestType";

export default function(req: Request, res: Response, next: any) {
    if (!req.identity || req.identity.type !== "User" || !req.identity.user.is_internal) {
        return next();
    }

    if (req.query.username) {
        req.user.username = req.query.username;
    }

    if (req.query.account_number) {
        req.user.account_number = req.query.account_number;
    }

    next();
}
