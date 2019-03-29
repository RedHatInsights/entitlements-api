// import Request from "./types/RequestType";
import Response from "./types/ResponseType";
import {getReq} from "./util/cls";

import _ from "lodash";
// const log = require('./util/log');
// const RequestSpecValidationError = require('./middleware/openapi/RequestSpecValidationError');

class HttpError extends Error {
    public error: { details: any; id: number; status: number; code: string; title: string; };
    public failedValidation: boolean;
    public originalResponse: any;
    constructor(status: number, code: string, title: string, details: any = {}) {
        super(title);
        const req = getReq();
        this.name = this.constructor.name;
        this.error = {
            code,
            details,
            id: req ? req.id : undefined,
            status,
            title
        };

        if (details) {
            this.error.details = details;
        }
    }

    public getError() {
        return this.error;
    }

    public writeResponse(res: Response) {
        res.status(this.error.status).json({
            errors: [this.getError()]
        }).end();
    }
}

// class InternalError extends Error {
//     public errorCode: string;
//     constructor(errorCode: string, message: string, details = {}) {
//         super(message);
//         this.errorCode = errorCode;
//         _.assign(this, details);
//     }
// }

// exports.InternalError = InternalError;

// exports.BadRequest = class BadRequest extends HttpError {
//     constructor(code: string, title: string, details: any) {
//         super(400, code, title, details);
//     }
// };

// exports.Unauthorized = class Unauthorized extends HttpError {
//     constructor() {
//         super(401, "UNAUTHORIZED", "Authorization headers missing");
//     }
// };

// exports.Forbidden = class Forbidden extends HttpError {
//     constructor() {
//         super(403, "FORBIDDEN", "Access forbidden");
//     }
// };

// exports.DependencyError = class DependencyError extends HttpError {
//     public cause: Error;
//     constructor(e: Error, connector: any) {
//         super(503, "DEPENDENCY_UNAVAILABLE", "Service dependency unavailable", {
//             name: connector.getName(),
//             impl: connector.getImpl()
//         });
//         this.cause = e;
//     }
// };

// function mapValidationError(req: Request, error: any) {
//     return { id: req.id, status: 400, error: error.code, title: error.title };
// }

// exports.handler = (error: any, req: Request, res: Response, next: Function) => {
//     if (res.headersSent) {
//         return next(error);
//     }

//     // openapi request validation handler
//     if (error.failedValidation && !error.originalResponse) {
//         if (error.code === "SCHEMA_VALIDATION_FAILED") {
//             const errors = error.results.errors;
//             // log.debug('rejecting request due to SCHEMA_VALIDATION_FAILED');

//             const status = 400;
//             return res
//             .status(status)
//             .json({
//                 errors: errors.map((error: { code: any; message: any; }) => mapValidationError(req, error))
//             })
//             .end();
//         }

//         const status = 400;
//         return res
//         .status(status)
//         .json({
//             errors: [mapValidationError(req, error)]
//         });
//     }

//     if (error instanceof exports.DependencyError) {
//         // log.error(error, 'rejecting request due to DependencyError');
//         return error.writeResponse(res);
//     } else if (error instanceof HttpError) {
//         // log.debug(error, 'rejecting request due to HttpError');
//         return error.writeResponse(res);
//     }

//     // if (error instanceof RequestSpecValidationError) {
//     //     // log.debug(error.errors, 'rejecting request due to RequestSpecValidationError');
//     //     return error.writeResponse(req, res);
//     // }

//     // log.error(error, 'caught internal error');

//     res.status(500).json({
//         errors: [{
//             id: req.id,
//             status: 500,
//             code: "INTERNAL_ERROR",
//             title: "Internal Server Error"
//         }]
//     });
// };

// exports.async = (fn: any) => (req: Request, res: Response, next: Function) => {
//     const result = fn(req, res, next);

//     if (!_.isUndefined(result) && _.isFunction(result.catch)) {
//         result.catch((e: Error) => next(e));
//     }

//     return result;
// };

// exports.unknownIssue = (id: { full: any; }) =>
//     new exports.BadRequest("UNKNOWN_ISSUE", `Unknown issue identifier "${id.full}"`);

// exports.unknownSystem = (id: any) =>
//     new exports.BadRequest("UNKNOWN_SYSTEM", `Unknown system identifier "${id}"`);

// exports.unsupportedIssue = (id: any) =>
//     new exports.BadRequest("UNSUPPORTED_ISSUE", `Issue "${id.full}" does not have Ansible support`);

// exports.unknownResolution = (id: any, resolution: any) =>
//     new exports.BadRequest("UNKNOWN_RESOLUTION", `Issue "${id.full}"
// does not have Ansible resolution "${resolution}"`);

// exports.invalidIssueId = (id: any) => new exports.BadRequest("INVALID_ISSUE_IDENTIFIER", `"${id}" is not a valid
// issue identifier.`);

// exports.internal = {
//     invalidTemplate(msg: string) {
//         return new InternalError("INVALID_TEMPLATE", msg);
//     },

//     invalidResolution(msg: string, template: any) {
//         return new InternalError("INVALID_RESOLUTION", msg, {template});
//     },

//     dependencyError(e: Error, connector: any) {
//         return new exports.DependencyError(e, connector);
//     },

//     preconditionFailed(msg: string) {
//         return new InternalError("PRECONDITION_FAILED", msg);
//     }
// };
