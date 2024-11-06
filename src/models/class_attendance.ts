import { Model, DataTypes, Optional } from 'sequelize';
import sequelize from "../database/index";
import User from './user';
import Class from './class';

interface ClassAttendanceAttributes {
  id: number;
  classId: number;
  userId: number;
}

interface ClassAttendanceCreationAttributes extends Optional<ClassAttendanceAttributes, 'id'> {}

class ClassAttendance extends Model<ClassAttendanceAttributes, ClassAttendanceCreationAttributes> implements ClassAttendanceAttributes {
  public id!: number;
  public classId!: number;
  public userId!: number;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

ClassAttendance.init(
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
    userId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: User,
        key: "id",
      },
    },
  },
  {
    sequelize,
    modelName: 'ClassAttendance',
    tableName: 'classes_attendances',
    timestamps: true,
  }
);

export default ClassAttendance;