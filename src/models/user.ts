import sequelize, { DataTypes } from "../database/index";

const User = sequelize.define("User", {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
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

    },

    nationality: {
        type: DataTypes.STRING,
        allowNull: false,
    }
});

User.sync();

export { User };
