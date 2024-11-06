import { z } from "zod";

const loginRequestSchema = z.object({
    password: z.string().min(8, "The password must be at least 8 characters."),
    email: z.string().email("It must be a valid email."),
});

export interface LoginRequest {
    email: string;
    password: string;
}

export function validateLoginRequestData(data: {}) {
    return loginRequestSchema.safeParse(data);
}
