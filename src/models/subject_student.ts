import { Model, DataTypes, Optional } from 'sequelize';
import sequelize from "../database/index";
import { Role } from '../utils/role';
import Subject from './subject';
import User from './user';
import { GeneralError } from '../errors/general_error';
import { StatusCodes } from 'http-status-codes';

interface SubjectStudentAttributes {
  id: number;
  subjectId: number;
  studentId: number;
  enrollmentDate: Date;
  grade?: number;
}

interface SubjectStudentCreationAttributes extends Optional<SubjectStudentAttributes, 'id'> {}

class SubjectStudent extends Model<SubjectStudentAttributes, SubjectStudentCreationAttributes> implements SubjectStudentAttributes {
  public id!: number;
  public subjectId!: number;
  public studentId!: number;
  public enrollmentDate!: Date;
  public grade?: number;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

SubjectStudent.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    subjectId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Subject,
        key: "id",
      },
    },
    studentId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: User,
        key: "id",
      },
    },
    enrollmentDate: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    grade: {
      type: DataTypes.NUMBER,
      allowNull: true
    }
  },
  {
    sequelize,
    modelName: 'SubjectStudent',
    tableName: 'subject_students',
    timestamps: true,
    hooks: {
        beforeCreate: async (subjectStudent, options) => {
            const user = await User.findByPk(subjectStudent.studentId);
            if (user?.role !== Role.STUDENT) {
                throw new GeneralError(StatusCodes.CONFLICT, "The user should be a Student");
            }
        }
    },
  }
);

export default SubjectStudent;