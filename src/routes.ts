import {Application, Request, Response} from "express";
import swaggerUi from "swagger-ui-express";
import swaggerDocument from "../swagger/api.spec.json";
import config from "./config";
import { getEntitlements } from "./entitlements/entitlements.controller";

export async function route(app: Application) {
    app.get( `${config.path.base}/v1/`, ( req: Request, res: Response) => {
        res.send( "lubDub" );
    });

    app.get(`${config.path.base}/v1/services/`, getEntitlements);
    app.use(`${config.path.base}/v1/api-docs/`, swaggerUi.serve, swaggerUi.setup(swaggerDocument));
}
