import { sequelize } from '../database/connection.js'
import { DataTypes } from 'sequelize'

export const Material = sequelize.define('Material', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: { type: DataTypes.STRING, allowNull: false },
  uri: { type: DataTypes.STRING, allowNull: false },
  type: { type: DataTypes.STRING, allowNull: false }
}, {
  timestamps: false
})
