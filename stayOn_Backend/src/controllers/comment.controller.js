import { Comment } from '../models/comment.model.js'
import { User } from '../models/user.model.js'
import { Post } from '../models/post.model.js'

export class CommentController {
  getAllComments = async (req, res) => {
    try {
      const comments = await Comment.findAll({
        include: [
          {
            model: User,
            as: 'User',
            attributes: { exclude: ['password'] }
          }
        ]
      })
      res.json(comments)
    } catch (error) {
      res.status(500).json({ message: error.message })
    }
  }

  createComment = async (req, res) => {
    try {
      const { message, postId, userId } = req.body

      const post = await Post.findByPk(postId)
      if (!post) {
        return res.status(404).json({
          message: 'Post not found',
          text: 'The post you are trying to comment on does not exist',
          forUser: true
        })
      }

      const user = await User.findByPk(userId)
      if (!user) {
        return res.status(404).json({
          message: 'User not found',
          text: 'The user does not exist',
          forUser: true
        })
      }

      const newComment = await Comment.create({
        message,
        postId,
        userId,
        date: new Date()
      })

      const commentWithUser = await Comment.findByPk(newComment.id, {
        include: [
          {
            model: User,
            as: 'User',
            attributes: { exclude: ['password'] }
          }
        ]
      })

      res.status(201).json(commentWithUser)
    } catch (error) {
      res.status(500).json({ message: error.message, forUser: false })
    }
  }

  getCommentById = async (req, res) => {
    try {
      const { id } = req.params
      const comment = await Comment.findByPk(id, {
        include: [
          {
            model: User,
            as: 'User',
            attributes: { exclude: ['password'] }
          }
        ]
      })

      if (comment) {
        res.json(comment)
      } else {
        res.status(404).json({
          message: 'Comment not found',
          text: 'The comment you are looking for does not exist',
          forUser: true
        })
      }
    } catch (error) {
      res.status(500).json({ message: error.message })
    }
  }

  getCommentsByPost = async (req, res) => {
    try {
      const { postId } = req.params
      const comments = await Comment.findAll({
        where: { postId },
        include: [
          {
            model: User,
            as: 'User',
            attributes: { exclude: ['password'] }
          }
        ],
        order: [['date', 'DESC']]
      })

      if (comments.length > 0) {
        res.json(comments)
      } else {
        res.status(404).json({
          message: 'No comments found',
          text: 'This post has no comments yet',
          forUser: true
        })
      }
    } catch (error) {
      res.status(500).json({ message: error.message })
    }
  }

  updateComment = async (req, res) => {
    try {
      const { id } = req.params
      const { message } = req.body

      const comment = await Comment.findByPk(id)
      if (!comment) {
        return res.status(404).json({
          message: 'Comment not found',
          text: 'The comment you are trying to update does not exist',
          forUser: true
        })
      }

      comment.message = message
      await comment.save()

      const updatedComment = await Comment.findByPk(id, {
        include: [
          {
            model: User,
            as: 'User',
            attributes: { exclude: ['password'] }
          }
        ]
      })

      res.json(updatedComment)
    } catch (error) {
      res.status(500).json({ message: error.message, forUser: false })
    }
  }

  deleteComment = async (req, res) => {
    try {
      const { id } = req.params
      const deleted = await Comment.destroy({ where: { id } })

      if (deleted) {
        res.status(200).json({ message: 'Comment deleted successfully', forUser: true })
      } else {
        res.status(404).json({
          message: 'Comment not found',
          text: 'The comment you are trying to delete does not exist',
          forUser: true
        })
      }
    } catch (error) {
      res.status(500).json({ message: error.message, forUser: false })
    }
  }
}
