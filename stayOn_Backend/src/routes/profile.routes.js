import { Router } from 'express'
import { ProfileController } from '../controllers/profile.controller.js'

const profileController = new ProfileController()

export const profileRouters = Router()

profileRouters.get('/api/profile/:userId', profileController.getProfile)
