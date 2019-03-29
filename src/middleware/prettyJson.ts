import Request from "../types/RequestType";
import Response from "../types/ResponseType";

const PARAM = "pretty";
const SPACES = 4;

export default (req: Request, res: Response, next: any) => {
    if (typeof req.query[PARAM] !== "undefined" ||
        (typeof req.headers["user-agent"] === "string" && req.headers["user-agent"].startsWith("Mozilla"))) {

        res.json = (body: any) => {
            if (!res.get("Content-Type")) {
                res.set("Content-Type", "application/json");
            }

            return res.send(JSON.stringify(body, null, SPACES));
        };
    }

    next();
};
