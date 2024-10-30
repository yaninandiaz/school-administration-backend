import morgan, { StreamOptions } from "morgan";
import { Request, Response } from "express";
import Logger from "../utils/logger";

const stream: StreamOptions = {
  write: (message) => Logger.http(message),
};

morgan.token("body", (req: Request, res: Response) => JSON.stringify(req.body));

morgan.token("token", (req: Request, res: Response) => {
    const authorization = req.headers.authorization;
  
    if (!authorization) {
        return 'No authorization header';
    }
  
    const parts = authorization.split(" ");
    let tokenToDisplay = '';
  
    if (parts.length > 1) {
      const token = parts[1];
      tokenToDisplay = `${parts[0]} ${token.slice(0, 2)}*****`;
    } else {
      tokenToDisplay = `${parts[0].slice(0, 2)}*****`;
    }
  
    return JSON.stringify(tokenToDisplay);
  });

const generalLogMiddleware = morgan(
  ":method :url :body :token :status - :response-time",
  {
    stream,
  }
);

export default generalLogMiddleware;