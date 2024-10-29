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
}

export const userService = new UserService();