import express, { json } from "express";
import indexRouter from "./routers";
import generalLogMiddleware from "./middlewares/general_logs";
import helmet from "helmet";
import { StatusCodes } from "http-status-codes";
import { errorHandler } from "./middlewares/error_handler";

const app = express();

app.use(helmet());

app.use(json());

app.use(generalLogMiddleware);

app.use(errorHandler);

app.get("/ping", (request: any, response: any) => {
    response.status(StatusCodes.OK).json({ message: "pong - the server is running" });
});

app.use("/", indexRouter);


export default app;