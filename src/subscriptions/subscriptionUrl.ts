import config from "../config";
import Request from "../types/RequestType";

/**
 * determines if app is running locally, on ci, qa, or prod
 * default is qa
 */
export = (req: Request) => {
    let subscriptionUrl = config.subscription.qa;

    if (process.env.NODE_ENV === "development") {
        return subscriptionUrl = config.subscription.dev;
    } else {
        const env = process.env.BACKEND_ENV;
        switch (env) {
            case "ci":
                subscriptionUrl = config.subscription.dev;
                break;
            case "prod":
                subscriptionUrl = config.subscription.prod;
                break;
            default:
                subscriptionUrl = config.subscription.prod;
        }
    }

    return subscriptionUrl;
};
