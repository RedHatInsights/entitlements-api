// tslint:disable-next-line:interface-name
export default interface Request {
    headers: any;
    id: string;
    identity: any;
    query: any;
    user: any;
    run(arg0: any): any;
}
