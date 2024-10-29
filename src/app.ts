import express, { json } from "express";
import indexRouter from "./routers";

const app = express();

app.use(json());

app.get("/ping", (request: any, response: any) => {
    response.status(200).json({ message: "pong - the server is running" });
});

app.use("/", indexRouter);


export default app;