import { Router } from "express";
import validateJWT from "../middlewares/verify-jwt";
import { subjectController } from "../controllers/subject_controller";
import { validateAdmin, validateAdminOrTeacher } from "../middlewares/role-validation";

const subjectRouter = Router();

subjectRouter.post("/", validateJWT, validateAdmin, subjectController.create);
subjectRouter.delete("/:id", validateJWT, validateAdmin, subjectController.delete);
subjectRouter.patch("/:id",validateJWT, validateAdminOrTeacher, subjectController.update);
subjectRouter.get("/:id",validateJWT, subjectController.getById);
subjectRouter.get("/",validateJWT, subjectController.getAll);

export default subjectRouter;