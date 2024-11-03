import { Router } from "express";
import validateJWT from "../middlewares/verify-jwt";
import { classController } from "../controllers/class_controller";

const classRouter = Router();

classRouter.post("/", validateJWT, classController.create);
classRouter.delete("/:id", validateJWT, classController.delete);
classRouter.patch("/:id",validateJWT, classController.update);
classRouter.get("/:id",validateJWT, classController.getById);
classRouter.get("/",validateJWT, classController.getAll);

export default classRouter;