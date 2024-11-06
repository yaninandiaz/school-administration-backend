import { Request, Response, NextFunction } from "express";
import Subject from "../models/subject";
import { subjectService } from "../services/subject_service";

class SubjectController {

    async create(request: Request, response: Response, next: NextFunction) {
        const newSubject = request.body as Subject;
        const result = await subjectService.create(newSubject)
        response.status(201).json(result)
    }

    async delete(request: Request, response: Response, next: NextFunction) {
        const subjectToDelete = request.params.id as unknown as number
        const result = await subjectService.delete(subjectToDelete)
        response.status(200).json(result)
    }

    async update(request: Request, response: Response, next: NextFunction) {
        // TODO
    }

    async getById(request: Request, response: Response, next: NextFunction) {
        const idSubjectToFind = request.params.id as unknown as number
        const result = await subjectService.getById(idSubjectToFind)
        response.status(200).json(result)
    }

    async getAll(request: Request, response: Response, next: NextFunction) {
        const result = await subjectService.getAll()
        response.status(200).json(result)
    }
}

export const subjectController = new SubjectController();