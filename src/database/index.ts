import { Sequelize, DataTypes } from "sequelize";
import dotenv from "dotenv";
import Logger from "../utils/logger";

dotenv.config();

const sequelize = new Sequelize(
  process.env.DATABASE_NAME as string,
  process.env.DATABASE_USERNAME as string,
  process.env.DATABASE_PASSWORD as string,
  {
    host: process.env.DATABASE_HOST as string,
    dialect: "postgres",
  }
);

(async () => {
  try {
    await sequelize.authenticate();
    Logger.info("Connection has been established successfully");
  } catch (error) {
    Logger.error("Unable to connect to the database: ", error);
  }
})();

export { DataTypes };
export default sequelize;