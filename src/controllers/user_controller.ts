import { Request, Response, NextFunction } from "express";
import { userService } from "../services/user_service";
import { UserRequest } from "../requests/user_request";
import { StatusCodes } from "http-status-codes";
import { UserToUpdateRequest } from "../requests/user_update_request";
import { LoginRequest } from "../requests/login_request";

class UserController {
    
    async create(request: Request, response: Response, next: NextFunction) {
        const newUser = request.body as UserRequest;
        const result = await userService.create(newUser)
        response.status(StatusCodes.CREATED).json(result)
    }

    async delete(request: Request, response: Response, next: NextFunction) {
        const userToDelete = request.params.id as unknown as number
        await userService.delete(request.requestingUser, userToDelete)
        response.status(StatusCodes.NO_CONTENT)
    }

    async update(request: Request, response: Response, next: NextFunction) {
        const userToUpdate = request.body as UserToUpdateRequest;
        const result = await userService.update(request.requestingUser, userToUpdate)
        response.status(StatusCodes.OK).json(result)
    }

    async getById(request: Request, response: Response, next: NextFunction) {
        const idUserToFind = request.params.id as unknown as number
        const result = await userService.getById(idUserToFind)
        response.status(StatusCodes.OK).json(result)
    }

    async getAll(request: Request, response: Response, next: NextFunction) {
        const page = request.query.page as unknown as number
        const pageSize = request.query.pageSize as unknown as number
        const result = await userService.getAll(request.requestingUser, page, pageSize);
        response.status(StatusCodes.OK).json(result)
    }

    async login(request: Request, response: Response, next: NextFunction) {
        const dataLogin = request.body as LoginRequest;
        const result = await userService.login(dataLogin)
        response.status(StatusCodes.OK).json(result)
    }

    async logout(request: Request, response: Response, next: NextFunction) {
        const userId = request.params.id as unknown as number;
        await userService.logout(request.requestingUser, userId)
        response.status(StatusCodes.NO_CONTENT)
    }
}

export const userController = new UserController();