import { Router } from "express"
import { userController } from "../controllers/user_controller";

const userRouter = Router();

userRouter.post("/", userController.create);
userRouter.delete("/:id", userController.delete);
userRouter.patch("/:id", userController.update);
userRouter.get("/:id", userController.getById);
userRouter.get("/", userController.getAll);

export default userRouter;