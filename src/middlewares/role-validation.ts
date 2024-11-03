import { Request, Response, NextFunction,  } from "express";
import { Role } from "../utils/role";

export async function validateAdmin(request: Request, response: Response, next: NextFunction) {
    if (request._role === Role.ADMIN) {
        next();
    }

    response.status(401).json({ error: "invalid role" });
}

export async function validateTeacher(request: Request, response: Response, next: NextFunction) {
    if (request._role === Role.TEACHER) {
        next();
    }

    response.status(401).json({ error: "invalid role" });
}

export async function validateStudent(request: Request, response: Response, next: NextFunction) {
    if (request._role === Role.STUDENT) {
        next();
    }

    response.status(401).json({ error: "invalid role" });
}

export async function validateAdminOrTeacher(request: Request, response: Response, next: NextFunction) {
    if (request._role === Role.ADMIN || request._role === Role.TEACHER) {
        next();
    }

    response.status(401).json({ error: "invalid role" });
}
