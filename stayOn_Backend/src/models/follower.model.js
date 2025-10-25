import { sequelize } from '../database/connection.js'

export const Follower = sequelize.define('Follower', {}, { timestamps: false })
