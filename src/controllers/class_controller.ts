import { Request, Response, NextFunction } from "express";
import { classService } from "../services/class_service";
import { ClassRequest } from "../requests/class_request";
import { StatusCodes } from "http-status-codes";
import { ClassToUpdateRequest } from "../requests/class_update_request";
import { StudentGradeRequest } from "../requests/student_grade_request";

class ClassController {

    async create(request: Request, response: Response, next: NextFunction) {
        const newClass = request.body as ClassRequest
        const result = await classService.create(newClass)
        response.status(StatusCodes.CREATED).json(result)
    }

    async delete(request: Request, response: Response, next: NextFunction) {
        const classToDelete = request.params.id as unknown as number
        await classService.delete(classToDelete)
        response.status(StatusCodes.NO_CONTENT)
    }

    async update(request: Request, response: Response, next: NextFunction) {
        const classToUpdate = request.body as ClassToUpdateRequest
        const idClassToUpdate = request.params.id as unknown as number
        const result = await classService.update(idClassToUpdate, classToUpdate)
        response.status(StatusCodes.OK).json(result)
    }

    async updateGrade(request: Request, response: Response, next: NextFunction) {
        const studentGrade = request.body as StudentGradeRequest
        const idClassToUpdate = request.params.class_id as unknown as number
        const idStudentToUpdate = request.params.student_id as unknown as number
        const result = await classService.updateGrade(idClassToUpdate, idStudentToUpdate, studentGrade)
        response.status(StatusCodes.OK).json(result)
    }

    async getById(request: Request, response: Response, next: NextFunction) {
        const idClassToFind = request.params.id as unknown as number
        const result = await classService.getById(idClassToFind)
        response.status(StatusCodes.OK).json(result)
    }

    async getAll(request: Request, response: Response, next: NextFunction) {
        const result = await classService.getAll()
        response.status(StatusCodes.OK).json(result)
    }

    async enrollStudent(request: Request, response: Response, next: NextFunction) {
        const classId = request.params.class_id as unknown as number
        const studentId = request.params.student_id as unknown as number
        const result = await classService.enrollStudent(classId, studentId)
        response.status(StatusCodes.OK).json(result)
    }

    async enrollTeacher(request: Request, response: Response, next: NextFunction) {
        const classId = request.params.class_id as unknown as number
        const teacherId = request.params.teacher_id as unknown as number
        const result = await classService.enrollTeacher(classId, teacherId)
        response.status(StatusCodes.OK).json(result)
    }

    async disenrollStudent(request: Request, response: Response, next: NextFunction) {
        const classId = request.params.class_id as unknown as number
        const studentId = request.params.student_id as unknown as number
        const result = await classService.disenrollStudent(classId, studentId)
        response.status(StatusCodes.OK).json(result)
    }

    async disenrollTeacher(request: Request, response: Response, next: NextFunction) {
        const classId = request.params.class_id as unknown as number
        const teacherId = request.params.teacher_id as unknown as number
        const result = await classService.disenrollTeacher(classId, teacherId)
        response.status(StatusCodes.OK).json(result)
    }
}

export const classController = new ClassController();