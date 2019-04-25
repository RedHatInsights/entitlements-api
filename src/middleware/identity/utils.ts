"use strict";

const IDENTITY_HEADER = "x-rh-identity";

const DEFAULTS = Object.freeze({
    account_number: "1",
    internal: {
        org_id: "1979710"
    },
    type: "User",
    user: {
        email: "tuser@redhat.com",
        first_name: "test",
        is_active: true,
        is_internal: true,
        is_org_admin: false,
        last_name: "user",
        locale: "en_US",
        username: "tuser@redhat.com"
    }
});

const createIdentityHeader = (
    // tslint:disable-next-line:variable-name
    account_number = DEFAULTS.account_number,
    // tslint:disable-next-line:variable-name
    is_internal = true,
    transform = (f: any) => f,
    username = DEFAULTS.user.username) => {

    const data = {
        identity: {
            account_number,
            internal: {
                org_id: DEFAULTS.internal.org_id
            },
            type: DEFAULTS.type,
            user: {
                ...DEFAULTS.user,
                is_internal,
                username
            }
        }
    };

    return encode(transform(data));
};

const createCertIdentityHeader = (accountNumber: string, transform = (f: any) => f) => {
    const data = {
        identity: {
            account_number: accountNumber,
            type: "System"
        }
    };

    return encode(transform(data));
};

function encode(data: string) {
    return Buffer.from(JSON.stringify(data)).toString("base64");
}

export {
    createCertIdentityHeader,
    createIdentityHeader,
    IDENTITY_HEADER
};
