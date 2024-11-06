import { Router } from "express";
import validateJWT from "../middlewares/verify-jwt";
import { subjectController } from "../controllers/subject_controller";

const subjectRouter = Router();

subjectRouter.post("/", validateJWT, subjectController.create);
subjectRouter.delete("/:id", validateJWT, subjectController.delete);
subjectRouter.patch("/:id",validateJWT, subjectController.update);
subjectRouter.get("/:id",validateJWT, subjectController.getById);
subjectRouter.get("/",validateJWT, subjectController.getAll);

export default subjectRouter;