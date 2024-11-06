import express, { json } from "express";
import indexRouter from "./routers";
import generalLogMiddleware from "./middlewares/general_logs";
import helmet from "helmet";

const app = express();

app.use(helmet());

app.use(json());

app.use(generalLogMiddleware);

app.get("/ping", (request: any, response: any) => {
    response.status(200).json({ message: "pong - the server is running" });
});

app.use("/", indexRouter);


export default app;