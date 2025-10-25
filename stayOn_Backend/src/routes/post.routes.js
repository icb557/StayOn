import { Router } from 'express'

import { PostController } from '../controllers/post.controller.js'
import { upload } from '../middleware/upload.js'

const postController = new PostController()
export const postRouters = Router()

postRouters.get('/api/post', postController.getAllPosts)
postRouters.get(
  '/api/post/preferences/:userId',
  postController.getPostsByUserPreferences
)
postRouters.get('/api/post/user/:userId', postController.getPostsByUser)
postRouters.get('/api/post/:id', postController.getPostById)
postRouters.patch('/api/post/:id', postController.updatePost)
postRouters.delete('/api/post/:id', postController.deletePost)
postRouters.post('/api/post', upload.array('files'), postController.createPost)
