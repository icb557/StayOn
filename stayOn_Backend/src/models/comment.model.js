import { sequelize } from '../database/connection.js'
import { DataTypes } from 'sequelize'

export const Comment = sequelize.define('Comment', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  message: { type: DataTypes.TEXT, allowNull: false },
  date: { type: DataTypes.DATE, allowNull: false }
}, {
  timestamps: false
})
