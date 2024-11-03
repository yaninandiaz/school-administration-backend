import { Request, Response, NextFunction } from "express";
import Class from "../models/class";
import { classService } from "../services/class_service";

class ClassController {

    async create(request: Request, response: Response, next: NextFunction) {
        const newClass = request.body as Class;
        const result = await classService.create(newClass)
        response.status(201).json(result)
    }

    async delete(request: Request, response: Response, next: NextFunction) {
        const classToDelete = request.params.id as unknown as number
        const result = await classService.delete(classToDelete)
        response.status(200).json(result)
    }

    async update(request: Request, response: Response, next: NextFunction) {
        // TODO
    }

    async getById(request: Request, response: Response, next: NextFunction) {
        const idClassToFind = request.params.id as unknown as number
        const result = await classService.getById(idClassToFind)
        response.status(200).json(result)
    }

    async getAll(request: Request, response: Response, next: NextFunction) {
        const result = await classService.getAll()
        response.status(200).json(result)
    }
}

export const classController = new ClassController();