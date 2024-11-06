import { Role } from "../utils/role";
import Class from "./class";
import ClassStudent from "./class_student";
import ClassTeacher from "./class_teacher";
import User from "./user";

// Relationship between Class and Student - many to many
Class.belongsToMany(User, {
    through: ClassStudent,
    as: "students",
    foreignKey: "classId",
    otherKey: "studentId",
    scope: {
        role: Role.STUDENT,
    }
});
User.belongsToMany(Class, {
    through: ClassStudent,
    as: "classes",
    foreignKey: "studentId",
    otherKey: "classId",
    scope: {
        role: Role.STUDENT,
    }
});

// Relationship between Class and Teacher - many to many
Class.belongsToMany(User, {
    through: ClassTeacher,
    as: "teachers",
    foreignKey: "classId",
    otherKey: "teacherId",
    scope: {
        role: Role.TEACHER,
    }
});
User.belongsToMany(Class, {
    through: ClassTeacher,
    as: "classesAsTeacher",
    foreignKey: "teacherId",
    otherKey: "classId",
    scope: {
        role: Role.TEACHER,
    }
});

export { User, Class, ClassStudent, ClassTeacher };