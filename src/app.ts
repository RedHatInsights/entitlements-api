import { createTerminus } from "@godaddy/terminus";
import P from "bluebird";
import express from "express";
import http from "http";
import config from "./config";
import { route } from "./routes";

const app = express();

async function healthCheck() {
    // TODO: fill this out later
}

async function start() {
    route(app);

    const server: any = P.promisifyAll(http.createServer(app));

    function shutdown() {
        // tslint:disable-next-line:no-console
        console.log("shutting down");
    }

    createTerminus(server, {
        healthChecks: {
            [`${config.path.base}/v1/health`]: healthCheck
        },
        signals: ["SIGINT", "SIGTERM"]
    });

    await server.listenAsync(config.port);
    // tslint:disable-next-line:no-console
    console.log( `server started at http://localhost:${ config.port }` );

    return {
        stop() {
            return server
            .closeAsync()
            .finally(shutdown);
        }
    };
}

module.exports = { start };

if (require.main === module) {
    start();
}
