import { StatusCodes } from "http-status-codes";
import { GeneralError } from "../errors/general_error";
import Subject from "../models/subject";
import { SubjectRequest, validateSubjectRequestData } from "../requests/subject_request";
import { SubjectResponse } from "../responses/subject_response";
import { SubjectToUpdateRequest, validateSubjectToUpdateRequestData } from "../requests/subject_update_request";
import { StudentGradeRequest, validateStudentGradeRequestData } from "../requests/student_grade_request";
import { SubjectStudent, SubjectTeacher, User } from "../models";
import { Role } from "../utils/role";

const DEFAULT_MSG_TO_CREATE = "There is no other previously created matter with the same characteristics";

class SubjectService {
    
    async create(newSubject: SubjectRequest): Promise<{ subject: SubjectResponse, message: string } | null> {
        const resultValidation = validateSubjectRequestData(newSubject);
        if (!resultValidation.success) {
            throw new GeneralError(StatusCodes.BAD_REQUEST, "Incorrect input for subject to create: " + JSON.stringify(resultValidation.error));
        }

        let message = null;
        const savedSubject = await this.getByName(newSubject.name);
        if (savedSubject && savedSubject.startDate == newSubject.startDate && savedSubject.endDate == newSubject.endDate) {
            message = "There is another matter already created with the same characteristics";
        }

        const subject = await Subject.create({ ...newSubject });

        return {
            subject: {
                id: subject.id,
                name: subject.name,
                startDate: subject.startDate,
                endDate: subject.endDate,
                isAvailableForRegistration: subject.isAvailableForRegistration ?? false,
            },
            message: message ?? DEFAULT_MSG_TO_CREATE,
        }
    }

    async update(subjectId: number, subjectToUpdate: SubjectToUpdateRequest): Promise<SubjectResponse | null> {
        const resultValidation = validateSubjectToUpdateRequestData(subjectToUpdate);
        if (!resultValidation.success) {
            throw new GeneralError(StatusCodes.BAD_REQUEST, "Incorrect input for subjet to update: " + JSON.stringify(resultValidation.error));
        }

        const savedSubject = await this.getById(subjectId);
        if (!savedSubject) {
            throw new GeneralError(StatusCodes.BAD_REQUEST, "Incorrect information");
        }

        await Subject.update(
            { ...savedSubject, ...subjectToUpdate },
            {
                where: {
                    id: subjectId,
                }
            }
        );

        const subject = await this.getById(subjectId);
        if (!subject) {
            return null;
        }

        return {
            id: subject.id,
            name: subject.name,
            startDate: subject.startDate,
            endDate: subject.endDate,
            isAvailableForRegistration: subject.isAvailableForRegistration ?? false,
        }
    }

    async updateGrade(idSubjectToUpdate: number, idStudentToUpdate: number, studentGrade: StudentGradeRequest): Promise<{message: string}> {
        const resultValidation = validateStudentGradeRequestData(studentGrade);
        if (!resultValidation.success) {
            throw new GeneralError(StatusCodes.BAD_REQUEST, "Incorrect input for grade: " + JSON.stringify(resultValidation.error));
        }

        const savedSubjectStudent = SubjectStudent.findOne({ where: { subjectId: idSubjectToUpdate, studentId: idStudentToUpdate } });
        if (!savedSubjectStudent) {
            throw new GeneralError(StatusCodes.BAD_REQUEST, "Incorrect information to update grade");
        }

        const result = await SubjectStudent.update(
            { grade: studentGrade.grade },
            {
                where: {
                    subjectId: idSubjectToUpdate, 
                    studentId: idStudentToUpdate
                }
            }
        );

        // TODO CHECK THE result

        return { message: "Grade assigned" };
    }

    async delete(idSubjectToDelete: number) {
        await Subject.destroy({
            where: {
                id: idSubjectToDelete
            }
        })
    }

    async getByName(nameToFind: string): Promise<Subject | null> {
        return await Subject.findOne({ where: { name: nameToFind } })
    }

    async getById(idSubjectToFind: number): Promise<Subject | null> {
        return await Subject.findByPk(idSubjectToFind);
    }

    async getAll(): Promise<Subject[] | null> {
        return await Subject.findAll();
    }

    async enrollStudent(subjectId: number, studentId: number): Promise<{ message: string }> {
        const savedSubject = Subject.findOne({ where: { id: subjectId } });
        const savedStudent = User.findOne({ where: { id: studentId, role: Role.STUDENT } });
        if (!savedSubject || !savedStudent) {
            throw new GeneralError(StatusCodes.BAD_REQUEST, "Incorrect information to enroll student");
        }

        const result = await SubjectStudent.create({
            subjectId,
            studentId,
            enrollmentDate: new Date(),
        });

        // TODO CHECK THE result

        return { message: "Student enrolls" };
    }

    async enrollTeacher(subjectId: number, teacherId: number): Promise<{ message: string }> {
        const savedSubject = Subject.findOne({ where: { id: subjectId } });
        const savedTeacher = User.findOne({ where: { id: teacherId, role: Role.TEACHER } });
        if (!savedSubject || !savedTeacher) {
            throw new GeneralError(StatusCodes.BAD_REQUEST, "Incorrect information to enroll teacher");
        }

        const result = await SubjectTeacher.update(
            { enrollmentDate: new Date() },
            {
                where: {
                    subjectId, 
                    teacherId
                }
            }
        );

        // TODO CHECK THE result

        return { message: "Teacher enrolls" };
    }

    async disenrollStudent(subjectId: number, studentId: number): Promise<{ message: string }> {
        const savedSubject = Subject.findOne({ where: { id: subjectId } });
        const savedStudent = User.findOne({ where: { id: studentId, role: Role.STUDENT } });
        if (!savedSubject || !savedStudent) {
            throw new GeneralError(StatusCodes.BAD_REQUEST, "Incorrect information to disenroll student");
        }

        const result = await SubjectStudent.destroy(
            {
                where: {
                    subjectId, 
                    studentId
                }
            }
        );

        // TODO CHECK THE result

        return { message: "Student enrolls" };
    }

    async disenrollTeacher(subjectId: number, teacherId: number): Promise<{ message: string }> {
        const savedSubject = Subject.findOne({ where: { id: subjectId } });
        const savedTeacher = User.findOne({ where: { id: teacherId, role: Role.TEACHER } });
        if (!savedSubject || !teacherId) {
            throw new GeneralError(StatusCodes.BAD_REQUEST, "Incorrect information to disenroll teacher");
        }

        const result = await SubjectTeacher.destroy(
            {
                where: {
                    subjectId, 
                    teacherId
                }
            }
        );

        // TODO CHECK THE result

        return { message: "Teacher disenrolls" };
    }
}

export const subjectService = new SubjectService();