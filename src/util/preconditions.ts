"use strict";

import _ from "lodash";
import log from "./log";

export const notNil = (value: any) => {
    if (_.isNil(value)) {
        log.error(`Precondition failed: got ${value}`);
    }

    return value;
};
