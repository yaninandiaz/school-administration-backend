import { Role } from "../utils/role";
import { z } from "zod";

const MINIMUM_AGE_TO_BE_A_TEACHER: number = 
    !process.env.MINIMUM_AGE_TO_BE_A_TEACHER ? 18 : process.env.MINIMUM_AGE_TO_BE_A_TEACHER as unknown as number;

const MINIMUM_AGE_TO_BE_A_STUDENT: number = 
    !process.env.MINIMUM_AGE_TO_BE_A_STUDENT ? 7 : process.env.MINIMUM_AGE_TO_BE_A_STUDENT as unknown as number;

const passwordRegex = /^(?=.[a-z])(?=.[A-Z])(?=.\d)(?=.[\W_]).{8,}$/;

const userRequestSchema = z.object({
    username: z.string().min(4, "The username must be at least 4 characters."),
    fullname: z.string().min(4, "The fullname must be at least 4 characters."),
    password: z
        .string()
        .min(8, "The password must be at least 8 characters.")
        .regex(passwordRegex, "The password must include uppercase and lowercase letters, numbers and special characters."),
    email: z.string().email("It must be a valid email."),
    birthday: z.date(),
    nationality: z.string().min(2, "Nationality is mandatory and must be at least 2 characters long."),
    role: z.nativeEnum(Role),
}).refine((data) => {
    const currentDate = new Date();
    const birthDate = new Date(data.birthday);
    const age = currentDate.getFullYear() - birthDate.getFullYear() -
        (currentDate.getMonth() < birthDate.getMonth() ||
            (currentDate.getMonth() === birthDate.getMonth() && currentDate.getDate() < birthDate.getDate()) ? 1 : 0);

    if (data.role === Role.TEACHER && age < MINIMUM_AGE_TO_BE_A_TEACHER) {
        return false;
    }
    if (data.role === Role.STUDENT && age < MINIMUM_AGE_TO_BE_A_STUDENT) {
        return false;
    }
    return true;
}, {
    message: "The birthday does not meet the age requirements for the specified role.",
});

export interface UserRequest {
    username: string;
    fullname: string;
    password: string;
    email: string;
    birthday: Date;
    nationality: string;
    role: Role;
}

export function validateUserRequestData(data: {}) {
    return userRequestSchema.safeParse(data);
}
