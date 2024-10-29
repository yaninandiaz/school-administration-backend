import { User } from "../models/user"

class UserService {

    async delete(idUserToDelete: number) {
        await User.destroy({
            where: {
                id: idUserToDelete
            }
        })
    }

    async create(newUser: typeof User): Promise<InstanceType<typeof User> | null> {
        return await User.create({ ...newUser });
    }

    async getById(idUserToFind: number): Promise<InstanceType<typeof User> | null> {
        return await User.findByPk(idUserToFind);
    }

    async getAll(): Promise<InstanceType<typeof User>[] | null> {
        return await User.findAll();
    }
}

export const userService = new UserService();