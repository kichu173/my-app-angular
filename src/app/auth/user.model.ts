export class User {
    constructor(
        public email: string,
        public id: string,
        private _token: string,
        private _tokenExpirationDate: Date
    ) {}

    get token() {// to access this getter property - user.token and user also cannot override this property.
        if (!this._tokenExpirationDate || new Date() > this._tokenExpirationDate) {//* if this._tokenExpirationDate does not exist and current timestamp is greater than this._tokenExpirationDate that means token is expired.
            return null;
        }
        return this._token;
    }
}