import { Op } from 'sequelize'
import { Topic } from '../models/topic.model.js'
import { Post } from '../models/post.model.js'
import { User } from '../models/user.model.js'
import { Material } from '../models/material.model.js'
import { Comment } from '../models/comment.model.js'

export class TopicController {
  getAllTopics = async (req, res) => {
    try {
      const topics = await Topic.findAll()
      res.json(topics)
    } catch (error) {
      res.status(500).json({ message: error.message })
    }
  }

  getTopicById = async (req, res) => {
    try {
      const { id } = req.params
      const topic = await Topic.findByPk(id)

      if (!topic) {
        return res.status(404).json({ message: 'Topic not found' })
      }

      res.json(topic)
    } catch (error) {
      res.status(500).json({ message: error.message })
    }
  }

  createTopic = async (req, res) => {
    try {
      const { name } = req.body

      if (!name) {
        return res.status(400).json({ message: 'Topic name is required' })
      }

      const existingTopic = await Topic.findOne({ where: { name: { [Op.iLike]: name } } })
      if (existingTopic) {
        return res.status(400).json({ message: 'Topic already exists' })
      }

      const newTopic = await Topic.create({ name })
      res.status(201).json(newTopic)
    } catch (error) {
      res.status(500).json({ message: error.message })
    }
  }

  deleteTopic = async (req, res) => {
    try {
      const { id } = req.params
      const topic = await Topic.findByPk(id)

      if (!topic) {
        return res.status(404).json({ message: 'Topic not found' })
      }

      await topic.destroy()
      res.status(204).send()
    } catch (error) {
      res.status(500).json({ message: error.message })
    }
  }

  updateTopic = async (req, res) => {
    try {
      const { id } = req.params
      const { name } = req.body

      if (!name) {
        return res.status(400).json({ message: 'Topic name is required' })
      }

      const topic = await Topic.findByPk(id)
      if (!topic) {
        return res.status(404).json({ message: 'Topic not found' })
      }

      const existingTopic = await Topic.findOne({ where: { name: { [Op.iLike]: name }, id: { [Op.ne]: id } } })
      if (existingTopic) {
        return res.status(400).json({ message: 'Topic with this name already exists' })
      }

      topic.name = name
      await topic.save()
      res.json(topic)
    } catch (error) {
      res.status(500).json({ message: error.message })
    }
  }

  getPostsByTopic = async (req, res) => {
    try {
      const { id } = req.params
      const topic = await Topic.findByPk(id, {
        include: [{
          model: Post,
          as: 'Posts',
          attributes: { exclude: ['topicId'] },
          include: [
            {
              model: User,
              as: 'User',
              attributes: { exclude: ['password', 'id'] }
            },
            {
              model: Comment,
              as: 'Comments',
              attributes: { exclude: ['postId'] },
              include: [{
                model: User,
                as: 'User',
                attributes: { exclude: ['password', 'id'] }
              }]
            },
            {
              model: Material,
              as: 'Materials',
              attributes: { exclude: ['postId'] }
            }, {
              model: Topic
            }
          ]
        }]
      })

      if (!topic) {
        return res.status(404).json({ message: 'Topic not found' })
      }

      res.json(topic.Posts)
    } catch (error) {
      res.status(500).json({ message: error.message })
    }
  }
}
