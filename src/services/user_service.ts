import { GeneralError } from "../errors/general_error";
import { createToken } from "../utils/token";
import User from "../models/user";

class UserService {

    async delete(idUserToDelete: number) {
        await User.destroy({
            where: {
                id: idUserToDelete
            }
        })
    }

    async create(newUser: any): Promise<{ user: User, token: string } | null> {
        const savedUser = await this.getByEmail(newUser.email)
        if (savedUser) {
            throw new GeneralError(400, "User already exists")
        }

        const user = await User.create({ ...newUser });

        const token = createToken({ id: user.id, role:user.role });

        return { user, token }
    }

    async getByEmail(email: string): Promise<User | null> {
        return await User.findOne({ where: { email: email } })
    }

    async getById(idUserToFind: number): Promise<User | null> {
        return await User.findByPk(idUserToFind);
    }

    async getAll(): Promise<User[] | null> {
        return await User.findAll();
    }
}

export const userService = new UserService();