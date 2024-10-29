import { Router } from "express"
import userRouter from "./user_router";

const indexRouter = Router();

indexRouter.use("/user", userRouter);

export default indexRouter;