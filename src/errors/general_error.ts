import { StatusCodes } from "http-status-codes";

export class GeneralError extends Error {
    private statusCode: number;
    public message: string;

    constructor(statusCode: StatusCodes, message: string) {
        super(message);
        this.statusCode = statusCode;
        this.message = message;

        Object.setPrototypeOf(this, GeneralError.prototype);
    }

    getStatusCode(): number {
        return this.statusCode;
    }
}