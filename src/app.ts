import express, { json } from "express";


const app = express();

app.use(json());

app.get("/ping", (request: any, response: any) => {
    response.status(200).json({ message: "pong - the server is running" });
});




export default app;