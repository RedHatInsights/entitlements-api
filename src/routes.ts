import {Application, Request, Response} from "express";

export async function route(app: Application) {
    app.get( "/", ( req: Request, res: Response) => {
        res.send( "lubDub" );
    });
}
