"use strict";

import P, { any } from "bluebird";

// tslint:disable-next-line
// import clsBluebird from "cls-bluebird";
import httpContext from "express-http-context";

// clsBluebird(httpContext.ns, P);

export const middleware = (req: Request, res: Response, next: any) => {
    httpContext.set("req", req);
    next();
};

export const getReq = () => {
    return httpContext.get("req");
};

export const patchMiddleware = (fn: any) => {
    return (req: Request, res: Response, next: any) => {
        return fn(req, res, httpContext.ns.bind(next));
    };
};
