import { Router } from "express";
import validateJWT from "../middlewares/verify-jwt";
import { classController } from "../controllers/class_controller";
import { validateAdmin, validateAdminOrTeacher } from "../middlewares/role-validation";

const classRouter = Router();

classRouter.post("/", validateJWT, validateAdminOrTeacher, classController.create);
classRouter.delete("/:id", validateJWT, validateAdmin, classController.delete);
classRouter.patch("/:id",validateJWT, validateAdminOrTeacher, classController.update);
classRouter.get("/:id",validateJWT, classController.getById);
classRouter.get("/",validateJWT, classController.getAll);

export default classRouter;