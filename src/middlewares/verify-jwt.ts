import { Request, Response, NextFunction,  } from "express";
import * as jwt from "jsonwebtoken";


async function validateJWT(request: Request, response: Response, next: NextFunction) {
  const token = request.headers.authorization?.split(" ")[1];

  if (!token) return response.status(400).json({ message: "token is required" });

  try {
    jwt.verify(token, process.env.SECRET_KEY as string) as any;

    

    next();
  } catch (error) {
    response.status(401).json({ error: "token inválido" });
  }
}

export default validateJWT;