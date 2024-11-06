import { Role } from "../utils/role";
import Subject from "./subject";
import SubjectStudent from "./subject_student";
import SubjectTeacher from "./subject_teacher";
import User from "./user";

// Relationship between Subject and Student - many to many
Subject.belongsToMany(User, {
    through: SubjectStudent,
    as: "students",
    foreignKey: "subjectId",
    otherKey: "studentId",
    scope: {
        role: Role.STUDENT,
    }
});
User.belongsToMany(Subject, {
    through: SubjectStudent,
    as: "subjects",
    foreignKey: "studentId",
    otherKey: "subjectId",
    scope: {
        role: Role.STUDENT,
    }
});

// Relationship between Subject and Teacher - many to many
Subject.belongsToMany(User, {
    through: SubjectTeacher,
    as: "teachers",
    foreignKey: "subjectId",
    otherKey: "teacherId",
    scope: {
        role: Role.TEACHER,
    }
});
User.belongsToMany(Subject, {
    through: SubjectTeacher,
    as: "subjectsAsTeacher",
    foreignKey: "teacherId",
    otherKey: "subjectId",
    scope: {
        role: Role.TEACHER,
    }
});

export { User, Subject, SubjectStudent, SubjectTeacher };