import { Router } from 'express'
import { UserController } from '../controllers/user.controller.js'
import { validateToken } from '../middleware/validateToken.js'

const userController = new UserController()
export const userRouters = Router()

userRouters.get('/api/user', validateToken, userController.getAllUsers)
userRouters.post('/api/user', userController.createUser)
userRouters.get('/api/user/:id', validateToken, userController.getUser)
userRouters.put('/api/user/:id', validateToken, userController.updateUser)
userRouters.delete('/api/user/:id', validateToken, userController.deleteUser)
userRouters.post('/api/user/login', userController.login)
userRouters.post(
  '/api/user/request-password-reset',
  userController.requestPasswordreset
)
userRouters.post('/api/user/reset-password', userController.changePassword)
