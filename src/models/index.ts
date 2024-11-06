import { Role } from "../utils/role";
import Class from "./class";
import ClassAttendance from "./class_attendance";
import Subject from "./subject";
import SubjectStudent from "./subject_student";
import SubjectTeacher from "./subject_teacher";
import User from "./user";

// Relationship between Subject and Class
Subject.hasMany(Class, { 
    foreignKey: "subjectId",
    as: "classes",
 });
Class.belongsTo(Subject, { 
    foreignKey: "subjectId",
    as: "subject",
 });
// Relationship between Class and guest teacher
Class.belongsTo(User, {
    foreignKey: "guestTeacherId",
    as: "guestTeacher",
});

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
    through: SubjectStudent,
    as: "subjects",
    foreignKey: "teacherId",
    otherKey: "subjectId",
    scope: {
        role: Role.TEACHER,
    }
});

// Relationship between Subject and User, for the attendance - many to many
User.belongsToMany(Class, {
    through: ClassAttendance,
    as: "classes",
    foreignKey: "userId",
    otherKey: "classId",
});
Class.belongsToMany(User, {
    through: ClassAttendance,
    as: "users",
    foreignKey: "classId",
    otherKey: "userId",
});

export { User, Subject, Class, ClassAttendance, SubjectStudent, SubjectTeacher };