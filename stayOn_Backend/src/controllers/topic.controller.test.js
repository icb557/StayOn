import { describe, it, expect, beforeEach, vi } from 'vitest'
import { TopicController } from './topic.controller.js'

import { Topic } from '../models/topic.model.js'

// Mock models
vi.mock('../models/topic.model.js', () => ({ Topic: { findAll: vi.fn(), findByPk: vi.fn(), findOne: vi.fn(), create: vi.fn() } }))
vi.mock('../models/post.model.js', () => ({ Post: {} }))
vi.mock('../models/user.model.js', () => ({ User: {} }))
vi.mock('../models/material.model.js', () => ({ Material: {} }))
vi.mock('../models/comment.model.js', () => ({ Comment: {} }))

function mockRes () {
  return {
    json: vi.fn(),
    status: vi.fn().mockReturnThis(),
    send: vi.fn()
  }
}

describe('TopicController', () => {
  let controller
  beforeEach(() => {
    controller = new TopicController()
    vi.clearAllMocks()
  })

  describe('getAllTopics', () => {
    it('should return all topics (happy)', async () => {
      Topic.findAll.mockResolvedValue([{ id: 1, name: 'Math' }])
      const res = mockRes()
      await controller.getAllTopics({}, res)
      expect(res.json).toHaveBeenCalledWith([{ id: 1, name: 'Math' }])
    })
    it('should handle errors (unhappy)', async () => {
      Topic.findAll.mockRejectedValue(new Error('fail'))
      const res = mockRes()
      await controller.getAllTopics({}, res)
      expect(res.status).toHaveBeenCalledWith(500)
      expect(res.json).toHaveBeenCalledWith({ message: 'fail' })
    })
  })

  describe('getTopicById', () => {
    it('should return topic by id (happy)', async () => {
      Topic.findByPk.mockResolvedValue({ id: 1, name: 'Math' })
      const req = { params: { id: 1 } }
      const res = mockRes()
      await controller.getTopicById(req, res)
      expect(res.json).toHaveBeenCalledWith({ id: 1, name: 'Math' })
    })
    it('should return 404 if not found (unhappy)', async () => {
      Topic.findByPk.mockResolvedValue(null)
      const req = { params: { id: 1 } }
      const res = mockRes()
      await controller.getTopicById(req, res)
      expect(res.status).toHaveBeenCalledWith(404)
      expect(res.json).toHaveBeenCalledWith({ message: 'Topic not found' })
    })
  })

  describe('createTopic', () => {
    it('should create topic (happy)', async () => {
      Topic.findOne.mockResolvedValue(null)
      Topic.create.mockResolvedValue({ id: 1, name: 'Math' })
      const req = { body: { name: 'Math' } }
      const res = mockRes()
      await controller.createTopic(req, res)
      expect(res.status).toHaveBeenCalledWith(201)
      expect(res.json).toHaveBeenCalledWith({ id: 1, name: 'Math' })
    })
    it('should not create if name missing (unhappy)', async () => {
      const req = { body: {} }
      const res = mockRes()
      await controller.createTopic(req, res)
      expect(res.status).toHaveBeenCalledWith(400)
      expect(res.json).toHaveBeenCalledWith({ message: 'Topic name is required' })
    })
    it('should not create if topic exists (unhappy)', async () => {
      Topic.findOne.mockResolvedValue({ id: 1, name: 'Math' })
      const req = { body: { name: 'Math' } }
      const res = mockRes()
      await controller.createTopic(req, res)
      expect(res.status).toHaveBeenCalledWith(400)
      expect(res.json).toHaveBeenCalledWith({ message: 'Topic already exists' })
    })
  })

  describe('deleteTopic', () => {
    it('should delete topic (happy)', async () => {
      const destroy = vi.fn()
      Topic.findByPk.mockResolvedValue({ id: 1, destroy })
      const req = { params: { id: 1 } }
      const res = mockRes()
      await controller.deleteTopic(req, res)
      expect(destroy).toHaveBeenCalled()
      expect(res.status).toHaveBeenCalledWith(204)
      expect(res.send).toHaveBeenCalled()
    })
    it('should return 404 if not found (unhappy)', async () => {
      Topic.findByPk.mockResolvedValue(null)
      const req = { params: { id: 1 } }
      const res = mockRes()
      await controller.deleteTopic(req, res)
      expect(res.status).toHaveBeenCalledWith(404)
      expect(res.json).toHaveBeenCalledWith({ message: 'Topic not found' })
    })
  })

  describe('updateTopic', () => {
    it('should update topic (happy)', async () => {
      const save = vi.fn()
      Topic.findByPk.mockResolvedValue({ id: 1, name: 'Math', save })
      Topic.findOne.mockResolvedValue(null)
      const req = { params: { id: 1 }, body: { name: 'Science' } }
      const res = mockRes()
      await controller.updateTopic(req, res)
      expect(save).toHaveBeenCalled()
      expect(res.json).toHaveBeenCalledWith({ id: 1, name: 'Science', save })
    })
    it('should not update if name missing (unhappy)', async () => {
      const req = { params: { id: 1 }, body: {} }
      const res = mockRes()
      await controller.updateTopic(req, res)
      expect(res.status).toHaveBeenCalledWith(400)
      expect(res.json).toHaveBeenCalledWith({ message: 'Topic name is required' })
    })
    it('should not update if topic not found (unhappy)', async () => {
      Topic.findByPk.mockResolvedValue(null)
      const req = { params: { id: 1 }, body: { name: 'Science' } }
      const res = mockRes()
      await controller.updateTopic(req, res)
      expect(res.status).toHaveBeenCalledWith(404)
      expect(res.json).toHaveBeenCalledWith({ message: 'Topic not found' })
    })
    it('should not update if name exists (unhappy)', async () => {
      Topic.findByPk.mockResolvedValue({ id: 1, name: 'Math', save: vi.fn() })
      Topic.findOne.mockResolvedValue({ id: 2, name: 'Science' })
      const req = { params: { id: 1 }, body: { name: 'Science' } }
      const res = mockRes()
      await controller.updateTopic(req, res)
      expect(res.status).toHaveBeenCalledWith(400)
      expect(res.json).toHaveBeenCalledWith({ message: 'Topic with this name already exists' })
    })
  })
})
