import {Request, Response} from "express";

export async function getEntitlements(req: Request, res: Response) {
    const sampleResponse = {
        "advisor": {
            isEntitled: true
        },
        "compliance": {
            isEntitled: false
        },
        "cost-management": {
            isEntitled: false
        },
        "remediations": {
            isEntitled: false
        },
        "vulnerability": {
            isEntitled: false
        }
    };

    return res.json(sampleResponse);
}
