import { Role } from "../utils/role";

export interface UserResponse {
    id: number;
    username: string;
    fullname: string;
    email: string;
    birthday: Date;
    nationality: string;
    role: Role;
    isActive: boolean;
  }