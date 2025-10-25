import { sequelize } from "../database/connection.js";
import { DataTypes } from "sequelize";
import { User } from "./user.model.js";

export const Meeting = sequelize.define(
  "Meeting",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    url: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isUrl: true,
      },
    },
    fechaReunion: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "Users",
        key: "id",
      },
    },
  },
  {
    timestamps: true,
  }
);

User.hasMany(Meeting, { foreignKey: "userId" });
Meeting.belongsTo(User, { foreignKey: "userId" });
