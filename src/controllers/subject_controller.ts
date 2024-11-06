import { Request, Response, NextFunction } from "express";
import { subjectService } from "../services/subject_service";
import { SubjectRequest } from "../requests/subject_request";
import { StatusCodes } from "http-status-codes";
import { SubjectToUpdateRequest } from "../requests/subject_update_request";
import { StudentGradeRequest } from "../requests/student_grade_request";

class SubjectController {

    async create(request: Request, response: Response, next: NextFunction) {
        const newSubject = request.body as SubjectRequest
        const result = await subjectService.create(newSubject)
        response.status(StatusCodes.CREATED).json(result)
    }

    async delete(request: Request, response: Response, next: NextFunction) {
        const subjectToDelete = request.params.id as unknown as number
        await subjectService.delete(subjectToDelete)
        response.status(StatusCodes.NO_CONTENT)
    }

    async update(request: Request, response: Response, next: NextFunction) {
        const subjectToUpdate = request.body as SubjectToUpdateRequest
        const idSubjectToUpdate = request.params.id as unknown as number
        const result = await subjectService.update(idSubjectToUpdate, subjectToUpdate)
        response.status(StatusCodes.OK).json(result)
    }

    async updateGrade(request: Request, response: Response, next: NextFunction) {
        const studentGrade = request.body as StudentGradeRequest
        const idSubjectToUpdate = request.params.subject_id as unknown as number
        const idStudentToUpdate = request.params.student_id as unknown as number
        const result = await subjectService.updateGrade(idSubjectToUpdate, idStudentToUpdate, studentGrade)
        response.status(StatusCodes.OK).json(result)
    }

    async getById(request: Request, response: Response, next: NextFunction) {
        const idSubjectToFind = request.params.id as unknown as number
        const result = await subjectService.getById(idSubjectToFind)
        response.status(StatusCodes.OK).json(result)
    }

    async getAll(request: Request, response: Response, next: NextFunction) {
        const result = await subjectService.getAll()
        response.status(StatusCodes.OK).json(result)
    }

    async enrollStudent(request: Request, response: Response, next: NextFunction) {
        const subjectId = request.params.subject_id as unknown as number
        const studentId = request.params.student_id as unknown as number
        const result = await subjectService.enrollStudent(subjectId, studentId)
        response.status(StatusCodes.OK).json(result)
    }

    async enrollTeacher(request: Request, response: Response, next: NextFunction) {
        const subjectId = request.params.subject_id as unknown as number
        const teacherId = request.params.teacher_id as unknown as number
        const result = await subjectService.enrollTeacher(subjectId, teacherId)
        response.status(StatusCodes.OK).json(result)
    }

    async disenrollStudent(request: Request, response: Response, next: NextFunction) {
        const subjectId = request.params.subject_id as unknown as number
        const studentId = request.params.student_id as unknown as number
        const result = await subjectService.disenrollStudent(subjectId, studentId)
        response.status(StatusCodes.OK).json(result)
    }

    async disenrollTeacher(request: Request, response: Response, next: NextFunction) {
        const subjectId = request.params.subject_id as unknown as number
        const teacherId = request.params.teacher_id as unknown as number
        const result = await subjectService.disenrollTeacher(subjectId, teacherId)
        response.status(StatusCodes.OK).json(result)
    }
}

export const subjectController = new SubjectController();