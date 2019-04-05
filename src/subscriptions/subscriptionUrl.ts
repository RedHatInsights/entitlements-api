import config from "../config";
import Request from "../types/RequestType";

/**
 * determines if app is running locally, on ci, qa, or prod
 * default is qa
 */
export = (req: Request) => {
    const envHeader = req.headers[config.envHeader];
    let subscriptionUrl = config.subscription.qa;

    if (process.env.NODE_ENV === "development") {
        return subscriptionUrl = config.subscription.dev;
    } else {
        switch (envHeader) {
            case "ci":
                subscriptionUrl = config.subscription.dev;
                break;
            case "prod":
                subscriptionUrl = config.subscription.prod;
                break;
        }
    }

    return subscriptionUrl;
};
