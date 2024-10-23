import { Request, Response, NextFunction, query } from "express";
import { userService } from "../services/user_service";
import {User} from "../models/user"

class UserController {
    async create(request: Request, response: Response, next: NextFunction) {
        const newUser= request.body as typeof User;
        const result = await userService.create(newUser)
         response.status(201).json(result)
       }

    async delete(request: Request, response: Response, next: NextFunction) {
        const userToDelete= request.params.id
        const result = await userService.delete(userToDelete)
         response.status(200).json (result)

    }
}
