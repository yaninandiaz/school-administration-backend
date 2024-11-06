import { Router } from "express";
import validateJWT from "../middlewares/verify-jwt";
import { classController } from "../controllers/class_controller";
import { validateAdmin, validateAdminOrStudent, validateAdminOrTeacher } from "../middlewares/role-validation";

const classRouter = Router();

classRouter.post("/", validateJWT, validateAdmin, classController.create);
classRouter.delete("/:id", validateJWT, validateAdmin, classController.delete);
classRouter.patch("/grade/:class_id/:student_id", validateJWT, validateAdminOrTeacher, classController.updateGrade);
classRouter.patch("/:id", validateJWT, validateAdminOrTeacher, classController.update);
classRouter.patch("/enrollment_student/:class_id/:student_id", validateJWT, validateAdminOrStudent, classController.enrollStudent);
classRouter.patch("/enrollment_teacher/:class_id/:teacher_id", validateJWT, validateAdmin, classController.enrollTeacher);
classRouter.patch("/disenrolled_student/:class_id/:student_id", validateJWT, validateAdminOrStudent, classController.disenrollStudent);
classRouter.patch("/disenrolled_teacher/:class_id/:teacher_id", validateJWT, validateAdmin, classController.disenrollTeacher);
classRouter.get("/:id", validateJWT, classController.getById);
classRouter.get("/", validateJWT, classController.getAll);

export default classRouter;