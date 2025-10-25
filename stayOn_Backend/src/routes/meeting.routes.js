import { MeetingController } from '../controllers/meeting.controller.js'
import { Router } from 'express'

export const meetingRouters = Router()

meetingRouters.get('/api/meetings', MeetingController.getAllMeetings)
meetingRouters.get('/api/meetings/:id', MeetingController.getMeeting)
meetingRouters.get(
  '/api/meetings/user/:userId',
  MeetingController.getMeetingsByUser
)
meetingRouters.post('/api/meetings', MeetingController.createMeeting)
meetingRouters.put('/api/meetings/:id', MeetingController.updateMeeting)
meetingRouters.delete('/api/meetings/:id', MeetingController.deleteMeeting)
meetingRouters.get('/api/meetings/active', MeetingController.getActiveMeetings)
meetingRouters.patch(
  '/api/meetings/:id/deactivate',
  MeetingController.deactivateMeeting
)
