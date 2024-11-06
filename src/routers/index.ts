import { Router } from "express"
import userRouter from "./user_router";
import classRouter from "./class_router";

const indexRouter = Router();

indexRouter.use("/user", userRouter);
indexRouter.use("/class", classRouter);

export default indexRouter;