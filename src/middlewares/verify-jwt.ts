import { Request, Response, NextFunction,  } from "express";
import * as jwt from "jsonwebtoken";
import { Role } from "../utils/role";

declare module "express-serve-static-core"{
    interface Request {
        _userId?: number;
        _role: Role;
    }
}

async function validateJWT(request: Request, response: Response, next: NextFunction) {
  const token = request.headers.authorization?.split(" ")[1];

  if (!token) {
    return response.status(400).json({ message: "token is required" });
  }

  try {
    const data = jwt.verify(token, process.env.SECRET_KEY as string) as any;
    request._userId = data.id;
    request._role = data.role

    next();
  } catch (error) {
    response.status(401).json({ error: "invalid token" });
  }
}

export default validateJWT;