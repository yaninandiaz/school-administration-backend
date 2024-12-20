import { z } from "zod";

const classRequestSchema = z.object({
    name: z.string().min(4, "The name must be at least 4 characters."),
    startDate: z.date(),
    endDate: z.date(),
}).refine((data) => {
    // We check that the end date is at least one day after the start date
    const diffInTime = data.endDate.getTime() - data.startDate.getTime();
    return diffInTime > 86400000; // 86400000 ms = 1 day
}, {
    message: "The end date must be at least 1 day after the start date.",
});

export interface ClassToUpdateRequest {
    name?: string;
    startDate?: Date;
    endDate?: Date;
}

export function validateClassToUpdateRequestData(data: {}) {
    return classRequestSchema.safeParse(data);
}
