import { Router } from "express"
import userRouter from "./user_router";
import classRouter from "./class_router";
import subjectRouter from "./subject_router";

const indexRouter = Router();

indexRouter.use("/user", userRouter);
indexRouter.use("/class", classRouter);
indexRouter.use("/subject", subjectRouter);

export default indexRouter;