import { sequelize } from '../database/connection.js'
import { DataTypes } from 'sequelize'

export const Topic = sequelize.define(
  'Topic',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    name: { type: DataTypes.STRING, allowNull: false }
  },
  {
    timestamps: false
  }
)
