import { Model, DataTypes, Optional } from 'sequelize';
import sequelize from "../database/index";

interface SubjectAttributes {
  id: number;
  name: string;
  startDate: Date;
  endDate: Date;
  isAvailableForRegistration?: boolean;
}

interface SubjectCreationAttributes extends Optional<SubjectAttributes, 'id'> {}

class Subject extends Model<SubjectAttributes, SubjectCreationAttributes> implements SubjectAttributes {
  public id!: number;
  public name!: string;
  public startDate!: Date;
  public endDate!: Date;
  public isAvailableForRegistration?: boolean;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Subject.init(
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
    },
    isAvailableForRegistration: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
    }
  },
  {
    sequelize,
    modelName: 'Subject',
    tableName: 'subjects',
    timestamps: true,
  }
);

export default Subject;