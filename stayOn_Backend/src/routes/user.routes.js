import { Router } from 'express'
import { UserController } from '../controllers/user.controller.js'

const userController = new UserController()
export const userRouters = Router()

userRouters.get('/api/user', userController.getAllUsers)
userRouters.post('/api/user', userController.createUser)
userRouters.get('/api/user/:id', userController.getUser)
userRouters.put('/api/user/:id', userController.updateUser)
userRouters.delete('/api/user/:id', userController.deleteUser)
userRouters.post('/api/user/login', userController.login)
userRouters.post(
  '/api/user/request-password-reset',
  userController.requestPasswordreset
)
userRouters.post('/api/user/reset-password', userController.changePassword)
