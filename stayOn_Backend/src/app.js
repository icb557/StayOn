import express from 'express'
import 'dotenv/config'
import cors from 'cors'

import fs from 'fs'
import path, { dirname } from 'path'
import { fileURLToPath } from 'url'

import { userRouters } from './routes/user.routes.js'
import { postRouters } from './routes/post.routes.js'
import { profileRouters } from './routes/profile.routes.js'
import { topicRouter } from './routes/topic.routes.js'
import { followerRouter } from './routes/follower.routes.js'
import { commentRouters } from './routes/comment.routes.js'
import { preferenceRouter } from './routes/preference.routes.js'
import { meetingRouters } from './routes/meeting.routes.js'

const app = express()

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const uploadsDir = path.join(__dirname, '../uploads')

if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true })
  console.log('📁 Carpeta "uploads" creada automáticamente.')
}

app.use(cors())
app.use(express.json())

app.use(userRouters)
app.use(postRouters)
app.use(profileRouters)
app.use(topicRouter)
app.use(followerRouter)
app.use(commentRouters)
app.use(preferenceRouter)
app.use(meetingRouters)
app.use('/uploads', express.static(path.join(__dirname, '../uploads')))

export default app
