import { sequelize } from './database/connection.js'
import { insertData } from './database/inserts.js'
import './models/follower.model.js'
import './models/preference.model.js'
import './models/material.model.js'
import './models/meeting.model.js'
import './models/comment.model.js'
import './models/topic.model.js'
import './models/post.model.js'
import './models/user.model.js'

try {
  await sequelize.sync({ force: true })
  await insertData()
  console.log('Database synchronized')
} catch (error) {
  console.error('Error synchronizing the database', error)
}
