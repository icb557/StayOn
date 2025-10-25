import { Sequelize } from 'sequelize'

export const sequelize = new Sequelize('stayonDB', 'stayon', '1234', {
  host: 'localhost',
  dialect: 'postgres'
})
