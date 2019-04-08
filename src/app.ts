import { createTerminus } from "@godaddy/terminus";
import P from "bluebird";
import express from "express";
import http from "http";
import config from "./config";
import { route } from "./routes";
import log from "./util/log";

const app = express();

async function healthCheck() {
    // TODO: fill this out later
}

async function start() {
    log.info(`Entitlements starting`);
    route(app);

    const server: any = P.promisifyAll(http.createServer(app));

    function shutdown() {
        log.info("shutting down");
    }

    createTerminus(server, {
        healthChecks: {
            [`${config.path.base}/v1/health`]: healthCheck
        },

        logger: (msg, error) => log.error(error, msg),

        signals: ["SIGINT", "SIGTERM"]
    });

    await server.listenAsync(config.port);
    log.info( `server started at ${config.path.base}:${ config.port }` );

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
