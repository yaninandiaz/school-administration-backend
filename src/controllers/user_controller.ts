import { Request, Response, NextFunction } from "express";
import { userService } from "../services/user_service";
import { User } from "../models/user"

class UserController {

    async create(request: Request, response: Response, next: NextFunction) {
        const newUser = request.body as typeof User;
        const result = await userService.create(newUser)
        response.status(201).json(result)
    }

    async delete(request: Request, response: Response, next: NextFunction) {
        const userToDelete = request.params.id as unknown as number
        const result = await userService.delete(userToDelete)
        response.status(200).json(result)
    }

    async update(request: Request, response: Response, next: NextFunction) {
        // TODO
    }

    async getById(request: Request, response: Response, next: NextFunction) {
        const idUserToFind = request.params.id as unknown as number
        const result = await userService.getById(idUserToFind)
        response.status(200).json(result)
    }

    async getAll(request: Request, response: Response, next: NextFunction) {
        const result = await userService.getAll()
        response.status(200).json(result)
    }
}

export const userController = new UserController();