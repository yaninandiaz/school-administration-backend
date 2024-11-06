import { Request, Response, NextFunction,  } from "express";
import * as jwt from "jsonwebtoken";
import { Role } from "../utils/role";
import { StatusCodes } from "http-status-codes";
import { RequestingUser } from "../utils/entity";

declare module "express-serve-static-core"{
    interface Request {
        requestingUser: RequestingUser;
    }
}

async function validateJWT(request: Request, response: Response, next: NextFunction) {
  const token = request.headers.authorization?.split(" ")[1];

  if (!token) {
    return response.status(StatusCodes.BAD_REQUEST).json({ message: "Token is required" });
  }

  try {
    const data = jwt.verify(token, process.env.SECRET_KEY as string) as any;
    request.requestingUser = { userId: data.id, role: data.role } as RequestingUser;

    next();
  } catch (error) {
    response.status(StatusCodes.UNAUTHORIZED).json({ error: "Invalid token" });
  }
}

export default validateJWT;