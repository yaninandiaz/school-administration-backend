import { Model, DataTypes, Optional } from 'sequelize';
import sequelize from "../database/index";
import User from './user';
import Class from './class';

interface ClassTeacherAttributes {
  id: number;
  classId: number;
  teacherId: number;
  enrollmentDate: Date;
}

interface ClassTeacherCreationAttributes extends Optional<ClassTeacherAttributes, 'id'> {}

class ClassTeacher extends Model<ClassTeacherAttributes, ClassTeacherCreationAttributes> implements ClassTeacherAttributes {
  public id!: number;
  public classId!: number;
  public teacherId!: number;
  public enrollmentDate!: Date;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

ClassTeacher.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    classId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: Class,
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
    enrollmentDate: {
      type: DataTypes.DATE,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: 'ClassTeacher',
    tableName: 'classes_teachers',
    timestamps: true,
  }
);

ClassTeacher.sync();

export default ClassTeacher;