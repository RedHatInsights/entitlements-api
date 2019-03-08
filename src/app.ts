import express = require("express");
import { route } from "./routes";

const app = express();
const port = 8080; // default port to listen

async function start() {
    route(app);
    app.listen(port, () => {
        // replace with logger
        // tslint:disable-next-line:no-console
        console.log( `server started at http://localhost:${ port }` );
    });
}

module.exports = { start };

if (require.main === module) {
    start();
}
