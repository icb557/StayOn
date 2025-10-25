import { Router } from 'express'
import { CommentController } from '../controllers/comment.controller.js'

const router = Router()
const controller = new CommentController()

router.get('/api/comments', controller.getAllComments)
router.post('/api/comment', controller.createComment)
router.get('/api/comment/:id', controller.getCommentById)
router.get('/api/post/:postId/comments', controller.getCommentsByPost)
router.patch('/api/comment/:id', controller.updateComment)
router.delete('/api/comment/:id', controller.deleteComment)

export const commentRouters = router
