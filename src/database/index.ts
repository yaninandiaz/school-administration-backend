import { Sequelize, DataTypes, Dialect } from "sequelize";

const sequelize = new Sequelize(
  process.env.DATABASE_NAME as string,
  process.env.DATABASE_USERNAME as string,
  process.env.DATABASE_PASSWORD as string,
  {
    host: process.env.DATABASE_HOST as string,
    dialect: "postgres",
  }
);

export { DataTypes };
export default sequelize;