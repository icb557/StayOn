import { sequelize } from '../database/connection.js'
import { DataTypes } from 'sequelize'
import { Comment } from './comment.model.js'
import { Material } from './material.model.js'
import { Topic } from './topic.model.js'

export const Post = sequelize.define(
  'Post',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    message: { type: DataTypes.TEXT, allowNull: false },
    date: { type: DataTypes.DATE, allowNull: false }
  },
  {
    timestamps: false
  }
)
Post.hasMany(Material, { foreignKey: 'postId' })
Material.belongsTo(Post, { foreignKey: 'postId' })

Post.hasMany(Comment, { foreignKey: 'postId' })
Comment.belongsTo(Post, { foreignKey: 'postId' })

Post.belongsTo(Topic, { foreignKey: 'topicId' })
Topic.hasMany(Post, { foreignKey: 'topicId' })
