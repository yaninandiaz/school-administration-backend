import { Model, DataTypes, Optional } from 'sequelize';
import sequelize from "../database/index";
import { Role, TEACHER_TYPE } from '../utils/role';
import Subject from './subject';
import User from './user';
import { GeneralError } from '../errors/general_error';
import { StatusCodes } from 'http-status-codes';

interface SubjectTeacherAttributes {
  id: number;
  subjectId: number;
  teacherId: number;
  teacherType: TEACHER_TYPE;
  enrollmentDate: Date;
}

interface SubjectTeacherCreationAttributes extends Optional<SubjectTeacherAttributes, 'id'> {}

class SubjectTeacher extends Model<SubjectTeacherAttributes, SubjectTeacherCreationAttributes> implements SubjectTeacherAttributes {
  public id!: number;
  public subjectId!: number;
  public teacherId!: number;
  public teacherType!: TEACHER_TYPE;
  public enrollmentDate!: Date;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

SubjectTeacher.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    subjectId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: Subject,
        key: "id",
      },
    },
    teacherId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: User,
        key: "id",
      },
    },
    teacherType: {
      type: DataTypes.ENUM(...Object.values(TEACHER_TYPE)),
      allowNull: false,
    },
    enrollmentDate: {
      type: DataTypes.DATE,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: 'SubjectTeacher',
    tableName: 'subjects_teachers',
    timestamps: true,
    hooks: {
        beforeCreate: async (subjectTeacher, options) => {
            const user = await User.findByPk(subjectTeacher.teacherId);
            if (user?.role !== Role.TEACHER) {
                throw new GeneralError(StatusCodes.CONFLICT, "The user should be a Teacher");
            }
        }
    },
  }
);

export default SubjectTeacher;