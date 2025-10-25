import { sequelize } from '../database/connection.js'

export const Preference = sequelize.define(
  'Preference',
  {},
  { timestamps: false }
)
