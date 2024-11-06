import { GeneralError } from "../errors/general_error";
import { createToken } from "../utils/token";
import User from "../models/user";
import { Role } from "../utils/role";
import { RequestingUser } from "../utils/entity";
import { Subject } from "../models";
import Logger from "../utils/logger";
import { StatusCodes } from "http-status-codes";
import { UserRequest, validateUserRequestData } from "../requests/user_request";
import { getSecurePassword } from "../utils/password";
import { UserResponse } from "../responses/user_response";
import { UserToUpdateRequest, validateUserToUpdateRequestData } from "../requests/user_update_request";

class UserService {

    async create(newUser: UserRequest): Promise<{ user: UserResponse, token: string } | null> {
        const resultValidation = validateUserRequestData(newUser);
        if (!resultValidation.success) {
            throw new GeneralError(StatusCodes.BAD_REQUEST, "Incorrect input for user to create: " + JSON.stringify(resultValidation.error));
        }

        const savedUser = await this.getByEmail(newUser.email);
        if (savedUser) {
            throw new GeneralError(StatusCodes.BAD_REQUEST, "User already exists");
        }

        const password = await getSecurePassword(newUser.password);
        const user = await User.create({ ...newUser, password, isActive: true });

        const token = createToken({ id: user.id, role: user.role });

        return { user, token }
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
                        model: Subject,
                        as: 'subjects',
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