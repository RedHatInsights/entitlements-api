import {Application, Request, Response} from "express";

import { getEntitlements } from "./entitlements/entitlements.controller";

export async function route(app: Application) {
    app.get( "/", ( req: Request, res: Response) => {
        res.send( "lubDub" );
    });

    app.get("/entitlements/:id", getEntitlements);
}
