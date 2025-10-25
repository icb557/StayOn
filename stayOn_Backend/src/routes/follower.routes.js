import { FollowerController } from '../controllers/follower.controller.js'
import { Router } from 'express'

export const followerRouter = Router()
followerRouter.post('/api/follower/:userId/follow', FollowerController.followUser)
followerRouter.delete('/api/follower/:userId/unfollow', FollowerController.unfollowUser)
followerRouter.get('/api/follower/:userId/followers', FollowerController.getFollowers)
followerRouter.get('/api/follower/:userId/following', FollowerController.getFollowing)
