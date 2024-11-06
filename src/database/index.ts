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

/*

constructor(database: string, username: string, password?: string, options?: Options);
  constructor(database: string, username: string, options?: Options);
  constructor(options?: Options);

  DATABASE_NAME=school
DATABASE_USERNAME=postgres
DATABASE_PASSWORD=
DATABASE_HOST=localhost
DATABASE_DIALECT=postgres

*/


export { DataTypes };
export default sequelize;