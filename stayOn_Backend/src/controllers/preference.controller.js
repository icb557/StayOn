import { Preference } from '../models/preference.model.js'
import { User } from '../models/user.model.js'
import { Topic } from '../models/topic.model.js'

export class PreferenceController {
  getAllPreferences = async (req, res) => {
    try {
      const preferences = await Preference.findAll()
      res.json(preferences)
    } catch (error) {
      res.status(500).json({ message: error.message })
    }
  }

  getUserPreferences = async (req, res) => {
    try {
      const { userId } = req.params
      const userPreferences = await User.findByPk(userId, {
        attributes: { include: [['id', 'userId']] },
        include: {
          model: Topic,
          through: { attributes: [] }
        }
      })

      if (!userPreferences) {
        return res.status(404).json({ message: 'preferences not found' })
      }

      res.json({ userId: userPreferences.userId, Topics: userPreferences.Topics })
    } catch (error) {
      res.status(500).json({ message: error.message })
    }
  }

  createPreference = async (req, res) => {
    try {
      const { userId, topicId } = req.body

      if (!userId || !topicId) {
        return res
          .status(400)
          .json({ message: 'userId and topicId are required' })
      }

      const user = await User.findByPk(userId)
      if (!user) {
        return res.status(404).json({ message: 'User not found' })
      }

      const topic = await Topic.findByPk(topicId)
      if (!topic) {
        return res.status(404).json({ message: 'Topic not found' })
      }

      const existingPreference = await Preference.findOne({
        where: { userId, topicId }
      })

      if (existingPreference) {
        return res.status(400).json({ message: 'Preference already exists' })
      }

      const newPreference = await Preference.create({ userId, topicId })
      res.status(201).json(newPreference)
    } catch (error) {
      res.status(500).json({ message: error.message })
    }
  }

  deleteUserPreference = async (req, res) => {
    try {
      const { userId, topicId } = req.params

      const preference = await Preference.findOne({
        where: { userId, topicId }
      })

      if (!preference) {
        return res.status(404).json({ message: 'Preference not found' })
      }

      await preference.destroy()
      res.status(204).send()
    } catch (error) {
      res.status(500).json({ message: error.message })
    }
  }
}
