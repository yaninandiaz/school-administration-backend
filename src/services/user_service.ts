import { GeneralError } from "../errors/general_error";
import { createToken } from "../utils/token";
import User from "../models/user";
import { Role } from "../utils/role";
import { RequestingUser } from "../utils/entity";
import { Class } from "../models";
import Logger from "../utils/logger";
import { StatusCodes } from "http-status-codes";
import { UserRequest, validateUserRequestData } from "../requests/user_request";
import { getSecurePassword } from "../utils/password";
import { UserResponse } from "../responses/user_response";
import { UserToUpdateRequest, validateUserToUpdateRequestData } from "../requests/user_update_request";
import { LoginRequest, validateLoginRequestData } from "../requests/login_request";
import { LoginResponse } from "../responses/login_response";

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

        const securityPassword = await getSecurePassword(dataLogin.password);
        if (savedUser.password !== securityPassword) {
            throw new GeneralError(StatusCodes.UNAUTHORIZED, "Unauthorized to login");
        }

        await User.update(
            { loginExpired: false },
            {
                where: {
                    id: savedUser.id,
                }
            }
        );

        const token = createToken({ id: savedUser.id, role: savedUser.role });

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
        return await User.create({ ...newUser, password, isActive: true, loginExpired: true });
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
        return await User.findByPk(idUserToFind);
    }

    async getAll(user: RequestingUser): Promise<UserResponse[]> {
        if (user.role === Role.ADMIN) {
            return await User.findAll();
        }

        const userById = await this.getById(user.userId);
        if (!userById) {
            return [];
        }

        if (user.role === Role.TEACHER) {
            // This person can only see its user and the students it has.
            const users: User[] = await this.getStudentsByTeacher(user.userId);
            const usersReponse = users.map(user => ({
                id: user.id,
                username: user.username,
                fullname: user.fullname,
                email: user.email,
                birthday: user.birthday,
                nationality: user.nationality,
                role: user.role,
                isActive: user.isActive,
            }));

            return [userById, ...usersReponse]
        }

        return [userById];
    }

    async getStudentsByTeacher(teacherId: number): Promise<User[]> {
        try {
            const students = await User.findAll({
                where: {
                    role: Role.STUDENT,
                },
                include: [
                    {
                        model: Class,
                        as: 'classes',
                        include: [
                            {
                                model: User,
                                as: 'teachers',
                                required: true,
                                where: {
                                    id: teacherId,
                                    role: Role.TEACHER,
                                },
                                through: {
                                    attributes: [],
                                },
                            },
                        ],
                    },
                ],
            });

            return students;
        } catch (error) {
            const message = 'Error fetching students by teacher';
            Logger.error(message, error);
            throw new GeneralError(StatusCodes.INTERNAL_SERVER_ERROR, message);
        }
    }

    private async getByEmail(email: string): Promise<User | null> {
        return await User.findOne({ where: { email: email } })
    }
}

export const userService = new UserService();