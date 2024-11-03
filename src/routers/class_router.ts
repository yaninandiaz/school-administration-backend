import { Router } from "express"
import { userController } from "../controllers/user_controller";
import validateJWT from "../middlewares/verify-jwt";

const classRouter = Router();

classRouter.post("/", userController.create);
classRouter.delete("/:id", validateJWT, userController.delete);
classRouter.patch("/:id",validateJWT, userController.update);
classRouter.get("/:id",validateJWT, userController.getById);
classRouter.get("/",validateJWT, userController.getAll);

export default classRouter;