import { Router } from "express";
import validateJWT from "../middlewares/verify-jwt";
import { subjectController } from "../controllers/subject_controller";
import { validateAdmin, validateAdminOrStudent, validateAdminOrTeacher } from "../middlewares/role-validation";

const subjectRouter = Router();

subjectRouter.post("/", validateJWT, validateAdmin, subjectController.create);
subjectRouter.delete("/:id", validateJWT, validateAdmin, subjectController.delete);
subjectRouter.patch("/grade/:subject_id/:student_id", validateJWT, validateAdminOrTeacher, subjectController.updateGrade);
subjectRouter.patch("/:id", validateJWT, validateAdminOrTeacher, subjectController.update);
subjectRouter.patch("/enrollment_student/:subject_id/:student_id", validateJWT, validateAdminOrStudent, subjectController.enrollStudent);
subjectRouter.patch("/enrollment_teacher/:subject_id/:teacher_id", validateJWT, validateAdmin, subjectController.enrollTeacher);
subjectRouter.patch("/disenrolled_student/:subject_id/:student_id", validateJWT, validateAdminOrStudent, subjectController.disenrollStudent);
subjectRouter.patch("/disenrolled_teacher/:subject_id/:teacher_id", validateJWT, validateAdmin, subjectController.disenrollTeacher);
subjectRouter.get("/:id", validateJWT, subjectController.getById);
subjectRouter.get("/", validateJWT, subjectController.getAll);

export default subjectRouter;