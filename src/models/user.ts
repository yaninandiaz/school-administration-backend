import { Model, DataTypes, Optional } from 'sequelize';
import sequelize from "../database/index";
import { Role } from '../utils/role';
import { boolean } from 'zod';

// User's attributes
interface UserAttributes {
  id: number;
  username: string;
  fullname: string;
  password: string;
  email: string;
  birthday: Date;
  nationality: string;
  role: Role;
  isActive: boolean;
  loginExpired: boolean;
}

// Define an optional type for the creation, excluding fields like id that Sequelize can handle automatically.
interface UserCreationAttributes extends Optional<UserAttributes, 'id'> {}

// Defines the model
class User extends Model<UserAttributes, UserCreationAttributes> implements UserAttributes {
  public id!: number;
  public username!: string;
  public fullname!: string;
  public password!: string;
  public email!: string;
  public birthday!: Date;
  public nationality!: string;
  public role!: Role;
  public isActive!: boolean;
  public loginExpired!: boolean;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

// Initialize the model with Sequelize
User.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    username: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    fullname: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    birthday: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    nationality: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    role: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    isActive: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
    },
    loginExpired: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    }
  },
  {
    sequelize,
    modelName: 'User',
    tableName: 'users',
    timestamps: true, // Sequelize adds createdAt and updatedAt fields
  }
);

export default User;