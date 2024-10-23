import { Sequelize, DataTypes } from "sequelize";

const sequelize = new Sequelize(
  "products",
  "postgres",
  "cami.ds3",
  {
    host:"localhost",
    dialect:"postgres",
  }
);


export { DataTypes };
export default sequelize;