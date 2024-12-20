import { z } from "zod";

const userRequestSchema = z.object({
    username: z.string().min(4, "The username must be at least 4 characters.").optional(),
    fullname: z.string().min(4, "The fullname must be at least 4 characters.").optional(),
    nationality: z.string().min(2, "Nationality is mandatory and must be at least 2 characters long.").optional(),
});

export interface UserToUpdateRequest {
    username?: string;
    fullname?: string;
    nationality?: string;
}

export function validateUserToUpdateRequestData(data: {}) {
    return userRequestSchema.safeParse(data);
}
