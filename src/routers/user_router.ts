import { Router } from "express"
import { userController } from "../controllers/user_controller";
import validateJWT from "../middlewares/verify-jwt";
import { validateAdminOrTeacher, validateRoleToDeleteUser, validateRoleToUpdateUser } from "../middlewares/role-validation";

const userRouter = Router();

userRouter.post("/register", userController.create);
userRouter.delete("/:id", validateJWT, validateRoleToDeleteUser, userController.delete);
userRouter.patch("/:id", validateJWT, validateRoleToUpdateUser, userController.update);
userRouter.get("/:id", validateJWT, userController.getById);
userRouter.get("/", validateJWT, userController.getAll);
userRouter.post("/login", userController.login);
userRouter.post("/logout/:id", validateJWT, userController.logout);

export default userRouter;