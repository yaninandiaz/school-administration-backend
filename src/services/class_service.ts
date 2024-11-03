import { GeneralError } from "../errors/general_error";
import Class from "../models/class";

class ClassService {

    async delete(idClassToDelete: number) {
        await Class.destroy({
            where: {
                id: idClassToDelete
            }
        })
    }

    async create(newClass: any): Promise<Class | null> {
        const savedClass = await this.getByName(newClass.name)
        if (savedClass) {
            throw new GeneralError(400, "Name already exists")
        }

        return await Class.create({ ...newClass });
    }

    async getByName(nameToFind: string): Promise<Class | null> {
        return await Class.findOne({ where: { name: nameToFind } })
    }

    async getById(idClassToFind: number): Promise<Class | null> {
        return await Class.findByPk(idClassToFind);
    }

    async getAll(): Promise<Class[] | null> {
        return await Class.findAll();
    }
}

export const classService = new ClassService();