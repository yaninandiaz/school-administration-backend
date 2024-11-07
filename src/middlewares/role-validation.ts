import { Request, Response, NextFunction,  } from "express";
import { Role } from "../utils/role";
import { StatusCodes } from "http-status-codes";

const ERROR_MESSAGE = "Do not have permissions to do this action";

export async function validateAdmin(request: Request, response: Response, next: NextFunction) {
    if (request.requestingUser.role === Role.ADMIN) {
        return next();
    }

    response.status(StatusCodes.UNAUTHORIZED).json({ error: ERROR_MESSAGE });
}

export async function validateTeacher(request: Request, response: Response, next: NextFunction) {
    if (request.requestingUser.role === Role.TEACHER) {
        return next();
    }

    response.status(StatusCodes.UNAUTHORIZED).json({ error: ERROR_MESSAGE });
}

export async function validateStudent(request: Request, response: Response, next: NextFunction) {
    if (request.requestingUser.role === Role.STUDENT) {
        return next();
    }

    response.status(StatusCodes.UNAUTHORIZED).json({ error: ERROR_MESSAGE });
}

export async function validateAdminOrTeacher(request: Request, response: Response, next: NextFunction) {
    const role = request.requestingUser.role;
    if (role === Role.ADMIN || role === Role.TEACHER) {
        return next();
    }

    response.status(StatusCodes.UNAUTHORIZED).json({ error: ERROR_MESSAGE });
}

export async function validateAdminOrStudent(request: Request, response: Response, next: NextFunction) {
    const role = request.requestingUser.role;
    if (role === Role.ADMIN || role === Role.STUDENT) {
        return next();
    }

    response.status(StatusCodes.UNAUTHORIZED).json({ error: ERROR_MESSAGE });
}

export async function validateRoleToUpdateUser(request: Request, response: Response, next: NextFunction) {
    if (request.requestingUser.role === Role.ADMIN) {
        return next();
    }

    const idUserToUpdate = request.params.id as unknown as number;
    if (idUserToUpdate == request.requestingUser.userId) {
        return next();
    }

    response.status(StatusCodes.UNAUTHORIZED).json({ error: ERROR_MESSAGE });
}

export async function validateRoleToDeleteUser(request: Request, response: Response, next: NextFunction) {
    await validateRoleToUpdateUser(request, response, next);
}
