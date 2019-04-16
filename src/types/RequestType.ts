// tslint:disable-next-line:interface-name
export default interface Request {
    headers: any;
    id: string;
    identity: any;
    query: any;
    user: any;
    run(opts: any): any;
}
