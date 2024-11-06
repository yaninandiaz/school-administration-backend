import { Router } from "express"
import userRouter from "./user_router";
import subjectRouter from "./subject_router";

const indexRouter = Router();

indexRouter.use("/user", userRouter);
indexRouter.use("/subject", subjectRouter);

export default indexRouter;