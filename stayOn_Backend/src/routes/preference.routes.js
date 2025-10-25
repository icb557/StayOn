import { PreferenceController } from '../controllers/preference.controller.js'
import { Router } from 'express'

const preferenceController = new PreferenceController()
export const preferenceRouter = Router()

preferenceRouter.get('/api/preferences/', preferenceController.getAllPreferences)
preferenceRouter.get('/api/preference/user/:userId', preferenceController.getUserPreferences)
preferenceRouter.post('/api/preference/', preferenceController.createPreference)
preferenceRouter.delete('/api/preference/user/:userId/topic/:topicId', preferenceController.deleteUserPreference)
