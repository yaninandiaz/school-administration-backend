import { Router } from "express"
import { userController } from "../controllers/user_controller";
import validateJWT from "../middlewares/verify-jwt";

const userRouter = Router();

userRouter.post("/", userController.create);
userRouter.post("/register", userController.create);
userRouter.delete("/:id", validateJWT, userController.delete);
userRouter.patch("/:id",validateJWT, userController.update);
userRouter.get("/:id",validateJWT, userController.getById);
userRouter.get("/",validateJWT, userController.getAll);

export default userRouter;