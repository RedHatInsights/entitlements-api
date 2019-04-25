import bodyParser from "body-parser";
import {Application, Request, Response} from "express";
import swaggerUi from "swagger-ui-express";
import swaggerDocument from "../swagger/api.spec.json";
import config from "./config";
import prettyJson from "./middleware/prettyJson";

import identity from "./middleware/identity/impl";

import { getEntitlements } from "./entitlements/entitlements.controller";

export async function route(app: Application) {

    if (config.demo === true) {
        // app.use(require("./middleware/identity/demo"));
    }

    if (process.env.NODE_ENV === "development" || process.env.NODE_ENV === "test") {
        app.use(require("./middleware/identity/fallback"));
    }

    // @ts-ignore
    app.use(identity);
    // @ts-ignore
    app.use(bodyParser.json({
        limit: config.bodyParserLimit
    }));

    // @ts-ignore
    app.use(prettyJson);

    app.get( `${config.path.base}/v1/`, ( req: Request, res: Response) => {
        res.send( "lubDub" );
    });

    // @ts-ignore
    app.get(`${config.path.base}/v1/services/`, getEntitlements);
    app.use(`${config.path.base}/v1/api-docs/`, swaggerUi.serve, swaggerUi.setup(swaggerDocument));
}
