import { Role } from "./role";

export interface RequestingUser {
    userId: number;
    role: Role;
}