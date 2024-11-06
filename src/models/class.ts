import { Model, DataTypes, Optional } from 'sequelize';
import sequelize from "../database/index";
import Subject from './subject';
import User from './user';
import { Role } from '../utils/role';
import { StatusCodes } from 'http-status-codes';
import { GeneralError } from '../errors/general_error';

interface ClassAttributes {
  id: number;
  name: string;
  date: Date;
  subjectId: number; // A class belongs to a subject
  guestTeacherId?: number; // A class could have a guest teacher
}

interface ClassCreationAttributes extends Optional<ClassAttributes, 'id'> {}

class Class extends Model<ClassAttributes, ClassCreationAttributes> implements ClassAttributes {
  public id!: number;
  public name!: string;
  public date!: Date;
  public subjectId!: number;
  public guestTeacherId?: number;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Class.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    date: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    subjectId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Subject,
        key: "id",
      },
    },
    guestTeacherId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: User,
        key: "id",
      },
      validate: {
        async isTeacher(value: number) {
          if (value) {
            const user = await User.findByPk(value);
            if (user?.role !== Role.TEACHER) {
              throw new GeneralError(StatusCodes.CONFLICT, "The user should be a Teacher");
            }
          }
        }
      },
    },
  },
  {
    sequelize,
    modelName: 'Class',
    tableName: 'classes',
    timestamps: true,
  }
);

export default Class;