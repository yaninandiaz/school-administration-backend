import { GeneralError } from "../errors/general_error";
import Subject from "../models/subject";

class SubjectService {

    async delete(idSubjectToDelete: number) {
        await Subject.destroy({
            where: {
                id: idSubjectToDelete
            }
        })
    }

    async create(newSubject: any): Promise<Subject | null> {
        // TODO: Maybe we can include extra validations to know if a subject is already in the database
        const savedSubject = await this.getByName(newSubject.name)
        if (savedSubject) {
            throw new GeneralError(400, "Name already exists")
        }

        return await Subject.create({ ...newSubject });
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
}

export const subjectService = new SubjectService();