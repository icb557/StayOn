import { sequelize } from '../database/connection.js'
import { DataTypes } from 'sequelize'
import { Post } from './post.model.js'
import { Comment } from './comment.model.js'
import { Follower } from './follower.model.js'
import { Topic } from './topic.model.js'
import { Preference } from './preference.model.js'

export const User = sequelize.define(
  'User',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    password: { type: DataTypes.STRING, allowNull: false },
    firstName: { type: DataTypes.STRING, allowNull: false },
    middleName: { type: DataTypes.STRING },
    lastName: { type: DataTypes.STRING, allowNull: false },
    secondLastName: { type: DataTypes.STRING },
    major: { type: DataTypes.STRING, allowNull: false },
    role: { type: DataTypes.STRING, allowNull: false },
    age: { type: DataTypes.INTEGER, allowNull: false }
  },
  {
    timestamps: false
  }
)

User.hasMany(Post, { foreignKey: 'userId' })
Post.belongsTo(User, { foreignKey: 'userId' })

User.hasMany(Comment, { foreignKey: 'userId' })
Comment.belongsTo(User, { foreignKey: 'userId' })

User.belongsToMany(User, {
  as: 'Followers',
  through: Follower,
  foreignKey: 'followedId',
  otherKey: 'followerId'
})
User.belongsToMany(User, {
  as: 'Following',
  through: Follower,
  foreignKey: 'followerId',
  otherKey: 'followedId'
})

User.belongsToMany(Topic, {
  through: Preference,
  foreignKey: 'userId',
  otherKey: 'topicId'
})

Topic.belongsToMany(User, {
  through: Preference,
  foreignKey: 'topicId',
  otherKey: 'userId'
})
