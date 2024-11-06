import { z } from "zod";

const studentGradeRequestSchema = z.object({
    grade: z.number().min(1, "The grade must be greater than or equal to 1"),
});

export interface StudentGradeRequest {
    grade: number;
}

export function validateStudentGradeRequestData(data: {}) {
    return studentGradeRequestSchema.safeParse(data);
}
