import { Model, DataTypes, Optional } from 'sequelize';
import sequelize from "../database/index";
import User from './user';
import Class from './class';

interface ClassStudentAttributes {
  id: number;
  classId: number;
  studentId: number;
  enrollmentDate: Date;
  grade?: number;
}

interface ClassStudentCreationAttributes extends Optional<ClassStudentAttributes, 'id'> {}

class ClassStudent extends Model<ClassStudentAttributes, ClassStudentCreationAttributes> implements ClassStudentAttributes {
  public id!: number;
  public classId!: number;
  public studentId!: number;
  public enrollmentDate!: Date;
  public grade?: number;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

ClassStudent.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    classId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Class,
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
      type: DataTypes.DOUBLE,
      allowNull: true
    }
  },
  {
    sequelize,
    modelName: 'ClassStudent',
    tableName: 'classes_students',
    timestamps: true,
  }
);

ClassStudent.sync();

export default ClassStudent;