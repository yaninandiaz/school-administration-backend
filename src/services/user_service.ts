import {User} from "../models/user"

class UserService {
    

    async delete(productToDelete: string) {
        throw new Error("Method not implemented.");
    }

    async create(newProduct: typeof User): Promise<InstanceType<typeof User> | null> {
        return await User.create({ ...newProduct });
    }
}
export const userService = new UserService()