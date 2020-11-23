

export class ApplicationError extends Error {
    constructor(m: string) {
        super(m);

        Object.setPrototypeOf(this, ApplicationError.prototype);
    }
}

export class ErrorService {

    setError(error: ApplicationError) {

    }
}