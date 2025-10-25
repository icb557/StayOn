import { TopicController } from '../controllers/topic.controller.js'
import { Router } from 'express'

const topicController = new TopicController()
export const topicRouter = Router()
topicRouter.get('/api/topic/', topicController.getAllTopics)
topicRouter.get('/api/topic/:id', topicController.getTopicById)
topicRouter.post('/api/topic/', topicController.createTopic)
topicRouter.delete('/api/topic/:id', topicController.deleteTopic)
topicRouter.patch('/api/topic/:id', topicController.updateTopic)
topicRouter.get('/api/topic/:id/posts', topicController.getPostsByTopic)
