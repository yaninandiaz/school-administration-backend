import * as jwt from "jsonwebtoken";
import { Role } from "./role";

function createToken(data: { id: number, role: Role }) {
  const token = jwt.sign(data, process.env.SECRET_KEY as string, {
    expiresIn: "1d", 
  });

  return token;
}

export { createToken };