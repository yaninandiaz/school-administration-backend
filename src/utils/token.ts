import * as jwt from "jsonwebtoken";

function createToken(data: string | Object) {
  const token = jwt.sign(data, process.env.SECRET_KEY as string, {
    expiresIn: "1d", 
  });

  return token;
}

export { createToken };