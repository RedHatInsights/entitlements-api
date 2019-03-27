import {Application, Request, Response} from "express";
import config from "./config";

import { getEntitlements } from "./entitlements/entitlements.controller";

export async function route(app: Application) {
    app.get( `${config.path.base}/v1/`, ( req: Request, res: Response) => {
        res.send( "lubDub" );
    });

    app.get(`${config.path.base}/v1/entitlements/`, getEntitlements);
}
