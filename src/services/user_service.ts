import { GeneralError } from "../errors/general_error";
import { createToken } from "../utils/token";
import User from "../models/user";
import { Role } from "../utils/role";
import { RequestingUser } from "../utils/entity";
import { StatusCodes } from "http-status-codes";
import { UserRequest, validateUserRequestData } from "../requests/user_request";
import { getSecurePassword } from "../utils/password";
import { UserResponse } from "../responses/user_response";
import { UserToUpdateRequest, validateUserToUpdateRequestData } from "../requests/user_update_request";
import { LoginRequest, validateLoginRequestData } from "../requests/login_request";
import { LoginResponse } from "../responses/login_response";
import bcrypt from "bcrypt";

class UserService {

    async login(dataLogin: LoginRequest): Promise<LoginResponse> {
        const resultValidation = validateLoginRequestData(dataLogin);
        if (!resultValidation.success) {
            throw new GeneralError(StatusCodes.BAD_REQUEST, "Incorrect input to login: " + JSON.stringify(resultValidation.error));
        }

        const savedUser = await this.getByEmail(dataLogin.email);
        if (!savedUser) {
            throw new GeneralError(StatusCodes.BAD_REQUEST, "Incorrect information to login");
        }

        const match = await bcrypt.compare(dataLogin.password, savedUser.dataValues.password);
        if (!match) {
            throw new GeneralError(StatusCodes.UNAUTHORIZED, "Unauthorized to login");
        }

        await User.update(
            { loginExpired: false },
            {
                where: {
                    id: savedUser.dataValues.id,
                }
            }
        );

        const token = createToken({ id: savedUser.dataValues.id, role: savedUser.dataValues.role });

        return { token }
    }

    async logout(requestingUser: RequestingUser, userId: number) {
        if (requestingUser.userId !== userId) {
            throw new GeneralError(StatusCodes.UNAUTHORIZED, "Unauthorized to logout");
        }

        const savedUser = await this.getById(userId);
        if (!savedUser) {
            throw new GeneralError(StatusCodes.BAD_REQUEST, "Incorrect information to logout");
        }

        await User.update(
            { loginExpired: true },
            {
                where: {
                    id: savedUser.id,
                }
            }
        );
    }

    async create(newUser: UserRequest): Promise<UserResponse | null> {
        const resultValidation = validateUserRequestData(newUser);
        if (!resultValidation.success) {
            throw new GeneralError(StatusCodes.BAD_REQUEST, "Incorrect input for user to create: " + JSON.stringify(resultValidation.error));
        }

        const savedUser = await this.getByEmail(newUser.email);
        if (savedUser) {
            throw new GeneralError(StatusCodes.BAD_REQUEST, "User already exists");
        }

        const password = await getSecurePassword(newUser.password);
        const user = await User.create({ ...newUser, password, isActive: true, loginExpired: true });

        return {
            id: user.dataValues.id,
            username: user.dataValues.username,
            fullname: user.dataValues.fullname,
            email: user.dataValues.email,
            birthday: user.dataValues.birthday,
            nationality: user.dataValues.nationality,
            role: user.dataValues.role,
            isActive: user.dataValues.isActive,
        }
    }

    async delete(requestingUser: RequestingUser, idUserToDelete: number) {
        if (requestingUser.role === Role.ADMIN) {
            await User.destroy({
                where: {
                    id: idUserToDelete
                }
            });
            return;
        }

        // For the rest of the roles, the user is deactivated, and can only do so on their own user.
        if (idUserToDelete == requestingUser.userId) {
            await User.update(
                { isActive: false },
                {
                    where: {
                        id: requestingUser.userId,
                    }
                }
            );
        }
    }

    async update(requestingUser: RequestingUser, userToUpdate: UserToUpdateRequest): Promise<UserResponse | null> {
        const resultValidation = validateUserToUpdateRequestData(userToUpdate);
        if (!resultValidation.success) {
            throw new GeneralError(StatusCodes.BAD_REQUEST, "Incorrect input for user to update: " + JSON.stringify(resultValidation.error));
        }

        const savedUser = await this.getById(requestingUser.userId);
        if (!savedUser) {
            throw new GeneralError(StatusCodes.BAD_REQUEST, "Incorrect information");
        }

        await User.update(
            { ...savedUser, ...userToUpdate },
            {
                where: {
                    id: requestingUser.userId,
                }
            }
        );

        const user = await this.getById(requestingUser.userId);
        if (!user) {
            return null;
        }

        return {
            id: user.id,
            username: user.username,
            fullname: user.fullname,
            email: user.email,
            birthday: user.birthday,
            nationality: user.nationality,
            role: user.role,
            isActive: user.isActive,
        }
    }

    async getById(idUserToFind: number): Promise<UserResponse | null> {
        const user = await User.findByPk(idUserToFind);

        if (!user) {
            return null;
        }

        return {
            id: user.dataValues.id,
            username: user.dataValues.username,
            fullname: user.dataValues.fullname,
            email: user.dataValues.email,
            birthday: user.dataValues.birthday,
            nationality: user.dataValues.nationality,
            role: user.dataValues.role,
            isActive: user.dataValues.isActive,
        }
    }

    async getAll(user: RequestingUser, page: number = 0, pageSize: number = 20): Promise<UserResponse[]> {
        if (user.role === Role.ADMIN) {
            const users = await User.findAll({
                limit: pageSize,
                offset: page == 0 ? 0 : (page - 1) * pageSize
            });

            return users.map(user => ({
                id: user.dataValues.id,
                username: user.dataValues.username,
                fullname: user.dataValues.fullname,
                email: user.dataValues.email,
                birthday: user.dataValues.birthday,
                nationality: user.dataValues.nationality,
                role: user.dataValues.role,
                isActive: user.dataValues.isActive,
            }));
        }

        const userById = await this.getById(user.userId);
        if (!userById) {
            return [];
        }

        return [userById];
    }

    private async getByEmail(email: string): Promise<User | null> {
        return await User.findOne({ where: { email: email } })
    }
}

export const userService = new UserService();