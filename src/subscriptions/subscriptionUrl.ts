import config from "../config";
import Request from "../types/RequestType";

export = (req: Request) => {
    const envHeader = req.headers[config.envHeader];
    let subscriptionUrl = config.subscription.qa;
    // tslint:disable-next-line:no-console
    console.log(envHeader);
    switch (envHeader) {
        case "qa":
            subscriptionUrl = config.subscription.qa;
            break;
        case "prod":
            subscriptionUrl = config.subscription.prod;
            break;
    }

    return subscriptionUrl;
};
