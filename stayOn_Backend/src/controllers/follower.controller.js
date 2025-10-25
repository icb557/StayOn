import { Follower } from '../models/follower.model.js'
import { User } from '../models/user.model.js'

export class FollowerController {
  static async followUser (req, res) {
    const { userId } = req.params
    const { followerId } = req.body

    try {
      await Follower.create({ followedId: userId, followerId })
      res.status(201).json({ message: 'Followed successfully' })
    } catch (error) {
      res.status(500).json({ error: 'Failed to follow user' })
    }
  }

  static async unfollowUser (req, res) {
    const { userId } = req.params
    const { followerId } = req.body

    try {
      await Follower.destroy({ where: { followedId: userId, followerId } })
      res.status(200).json({ message: 'Unfollowed successfully' })
    } catch (error) {
      res.status(500).json({ error: 'Failed to unfollow user' })
    }
  }

  static async getFollowers (req, res) {
    const { userId } = req.params

    try {
      const followers = await User.findByPk(userId, {
        attributes: { exclude: ['password'] },
        include: [
          {
            model: User,
            as: 'Followers',
            attributes: { exclude: ['password'] },
            through: { attributes: [] }
          }
        ]
      })
      if (followers) {
        res.json(followers.Followers)
      } else {
        res.status(404).json({ error: 'User not found' })
      }
    } catch (error) {
      res.status(500).json({ error: 'Failed to retrieve followers' })
    }
  }

  static async getFollowing (req, res) {
    const { userId } = req.params

    try {
      const following = await User.findByPk(userId, {
        attributes: { exclude: ['password'] },
        include: [
          {
            model: User,
            as: 'Following',
            attributes: { exclude: ['password'] },
            through: { attributes: [] }
          }
        ]
      })
      if (following) {
        res.json(following.Following)
      } else {
        res.status(404).json({ error: 'User not found' })
      }
    } catch (error) {
      res.status(500).json({ error: 'Failed to retrieve following' })
    }
  }
}
