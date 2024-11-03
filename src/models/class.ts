import { Model, DataTypes, Optional } from 'sequelize';
import sequelize from "../database/index";

interface ClassAttributes {
  id: number;
  name: string;
  startDate: Date;
  endDate: Date;
}

interface ClassCreationAttributes extends Optional<ClassAttributes, 'id'> {}

class Class extends Model<ClassAttributes, ClassCreationAttributes> implements ClassAttributes {
  public id!: number;
  public name!: string;
  public startDate!: Date;
  public endDate!: Date;

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
    startDate: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    endDate: {
        type: DataTypes.DATE,
        allowNull: false,

    }
  },
  {
    sequelize,
    modelName: 'Class',
    tableName: 'classes',
    timestamps: true,
  }
);

export default Class;