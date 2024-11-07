import { StatusCodes } from "http-status-codes";
import { GeneralError } from "../errors/general_error";
import Class from "../models/class";
import { ClassRequest, validateClassRequestData } from "../requests/class_request";
import { ClassToUpdateRequest, validateClassToUpdateRequestData } from "../requests/class_update_request";
import { StudentGradeRequest, validateStudentGradeRequestData } from "../requests/student_grade_request";
import { ClassStudent, ClassTeacher, User } from "../models";
import { Role } from "../utils/role";
import { ClassResponse } from "../responses/class_response";

const DEFAULT_MSG_TO_CREATE = "There is no other previously created matter with the same characteristics";

class ClassService {
    
    async create(newClass: ClassRequest): Promise<{ class: ClassResponse, message: string } | null> {
        const resultValidation = validateClassRequestData(newClass);
        if (!resultValidation.success) {
            throw new GeneralError(StatusCodes.BAD_REQUEST, "Incorrect input for class to create: " + JSON.stringify(resultValidation.error));
        }

        let message = null;
        const savedClass = await this.getByName(newClass.name);
        if (savedClass && savedClass.dataValues.startDate == newClass.startDate && savedClass.dataValues.endDate == newClass.endDate) {
            message = "There is another matter already created with the same characteristics";
        }

        const oneClass = await Class.create({ ...newClass });

        return {
            class: {
                id: oneClass.dataValues.id,
                name: oneClass.dataValues.name,
                startDate: oneClass.dataValues.startDate,
                endDate: oneClass.dataValues.endDate,
            },
            message: message ?? DEFAULT_MSG_TO_CREATE,
        }
    }

    async update(classId: number, classToUpdate: ClassToUpdateRequest): Promise<ClassResponse | null> {
        const resultValidation = validateClassToUpdateRequestData(classToUpdate);
        if (!resultValidation.success) {
            throw new GeneralError(StatusCodes.BAD_REQUEST, "Incorrect input for class to update: " + JSON.stringify(resultValidation.error));
        }

        const savedClass = await this.getById(classId);
        if (!savedClass) {
            throw new GeneralError(StatusCodes.BAD_REQUEST, "Incorrect information");
        }

        await Class.update(
            { ...savedClass.dataValues, ...classToUpdate },
            {
                where: {
                    id: classId,
                }
            }
        );

        const oneClass = await this.getById(classId);
        if (!oneClass) {
            return null;
        }

        return {
            id: oneClass.dataValues.id,
            name: oneClass.dataValues.name,
            startDate: oneClass.dataValues.startDate,
            endDate: oneClass.dataValues.endDate,
        }
    }

    async updateGrade(idClassToUpdate: number, idStudentToUpdate: number, studentGrade: StudentGradeRequest): Promise<{message: string}> {
        const resultValidation = validateStudentGradeRequestData(studentGrade);
        if (!resultValidation.success) {
            throw new GeneralError(StatusCodes.BAD_REQUEST, "Incorrect input for grade: " + JSON.stringify(resultValidation.error));
        }

        const savedClassStudent = await ClassStudent.findOne({ where: { classId: idClassToUpdate, studentId: idStudentToUpdate } });
        if (!savedClassStudent) {
            throw new GeneralError(StatusCodes.BAD_REQUEST, "Incorrect information to update grade");
        }

        await ClassStudent.update(
            { grade: studentGrade.grade },
            {
                where: {
                    classId: idClassToUpdate, 
                    studentId: idStudentToUpdate
                }
            }
        );

        return { message: "Grade assigned" };
    }

    async delete(idClassToDelete: number) {
        await Class.destroy({
            where: {
                id: idClassToDelete
            }
        })
    }

    async getByName(nameToFind: string): Promise<Class | null> {
        return await Class.findOne({ where: { name: nameToFind } })
    }

    async getById(idClassToFind: number): Promise<Class | null> {
        return await Class.findByPk(idClassToFind);
    }

    async getAll(page: number = 0, pageSize: number = 20): Promise<Class[] | null> {
        return await Class.findAll({
            limit: pageSize,
            offset: page == 0 ? 0 : (page - 1) * pageSize
        });
    }

    async enrollStudent(classId: number, studentId: number): Promise<{ message: string }> {
        const savedClass = await Class.findOne({ where: { id: classId } });
        const savedStudent = await User.findOne({ where: { id: studentId, role: Role.STUDENT } });
        if (!savedClass || !savedStudent) {
            throw new GeneralError(StatusCodes.BAD_REQUEST, "Incorrect information to enroll student");
        }

        await ClassStudent.create({
            classId,
            studentId,
            enrollmentDate: new Date(),
        });

        return { message: "Student enrolls" };
    }

    async enrollTeacher(classId: number, teacherId: number): Promise<{ message: string }> {
        const savedClass = await Class.findOne({ where: { id: classId } });
        const savedTeacher = await User.findOne({ where: { id: teacherId, role: Role.TEACHER } });
        if (!savedClass || !savedTeacher) {
            throw new GeneralError(StatusCodes.BAD_REQUEST, "Incorrect information to enroll teacher");
        }

        await ClassTeacher.create({
            classId,
            teacherId,
            enrollmentDate: new Date(),
        });

        return { message: "Teacher enrolls" };
    }

    async disenrollStudent(classId: number, studentId: number): Promise<{ message: string }> {
        const savedClass = await Class.findOne({ where: { id: classId } });
        const savedStudent = await User.findOne({ where: { id: studentId, role: Role.STUDENT } });
        if (!savedClass || !savedStudent) {
            throw new GeneralError(StatusCodes.BAD_REQUEST, "Incorrect information to disenroll student");
        }

        await ClassStudent.destroy(
            {
                where: {
                    classId, 
                    studentId
                }
            }
        );

        return { message: "Student disenrolls" };
    }

    async disenrollTeacher(classId: number, teacherId: number): Promise<{ message: string }> {
        const savedClass = await Class.findOne({ where: { id: classId } });
        const savedTeacher = await User.findOne({ where: { id: teacherId, role: Role.TEACHER } });
        if (!savedClass || !savedTeacher) {
            throw new GeneralError(StatusCodes.BAD_REQUEST, "Incorrect information to disenroll teacher");
        }

        await ClassTeacher.destroy(
            {
                where: {
                    classId, 
                    teacherId
                }
            }
        );

        return { message: "Teacher disenrolls" };
    }
}

export const classService = new ClassService();