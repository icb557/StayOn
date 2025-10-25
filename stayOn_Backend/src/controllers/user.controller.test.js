import { describe, it, expect, beforeEach, vi } from 'vitest'

import { UserController } from './user.controller.js'
import { User } from '../models/user.model.js'

vi.mock('bcrypt', () => ({
  default: {
    hash: vi.fn().mockResolvedValue('hashedpassword'),
    compare: vi.fn()
  }
}))

vi.mock('../models/user.model.js', () => ({ User: { findAll: vi.fn(), findOne: vi.fn(), findByPk: vi.fn(), create: vi.fn(), destroy: vi.fn() } }))

function mockRes () {
  return {
    json: vi.fn(),
    status: vi.fn().mockReturnThis(),
    send: vi.fn()
  }
}

describe('UserController', () => {
  let controller
  beforeEach(() => {
    controller = new UserController()
    vi.clearAllMocks()
  })

  describe('getAllUsers', () => {
    it('should return all users (happy)', async () => {
      User.findAll.mockResolvedValue([{ id: 1, email: 'a@elpoli.edu.co' }])
      const res = mockRes()
      await controller.getAllUsers({}, res)
      expect(res.json).toHaveBeenCalledWith([{ id: 1, email: 'a@elpoli.edu.co' }])
    })
    it('should handle errors (unhappy)', async () => {
      User.findAll.mockRejectedValue(new Error('fail'))
      const res = mockRes()
      await controller.getAllUsers({}, res)
      expect(res.status).toHaveBeenCalledWith(500)
      expect(res.json).toHaveBeenCalledWith({ message: 'fail' })
    })
  })

  describe('createUser', () => {
    it('should not create if email not elpoli (unhappy)', async () => {
      const req = { body: { email: 'a@gmail.com', password: '123', firstName: 'A' } }
      const res = mockRes()
      await controller.createUser(req, res)
      expect(res.status).toHaveBeenCalledWith(400)
      expect(res.json).toHaveBeenCalledWith({ message: 'Email must end with @elpoli.edu.co' })
    })
    it('should not create if user exists (unhappy)', async () => {
      User.findOne.mockResolvedValue({ id: 1 })
      const req = { body: { email: 'a@elpoli.edu.co', password: '123', firstName: 'A' } }
      const res = mockRes()
      await controller.createUser(req, res)
      expect(res.status).toHaveBeenCalledWith(400)
      expect(res.json).toHaveBeenCalledWith({ message: 'User already exists' })
    })
  })

  describe('getUser', () => {
    it('should return user by id (happy)', async () => {
      User.findByPk.mockResolvedValue({ id: 1, email: 'a@elpoli.edu.co' })
      const req = { params: { id: 1 } }
      const res = mockRes()
      await controller.getUser(req, res)
      expect(res.json).toHaveBeenCalledWith({ id: 1, email: 'a@elpoli.edu.co' })
    })
    it('should return 404 if not found (unhappy)', async () => {
      User.findByPk.mockResolvedValue(null)
      const req = { params: { id: 1 } }
      const res = mockRes()
      await controller.getUser(req, res)
      expect(res.status).toHaveBeenCalledWith(404)
      expect(res.json).toHaveBeenCalledWith({ message: 'User not found' })
    })
  })

  describe('updateUser', () => {
    it('should update user (happy)', async () => {
      const update = vi.fn().mockResolvedValue()
      User.findByPk.mockResolvedValue({ update })
      const req = { params: { id: 1 }, body: { firstName: 'B' } }
      const res = mockRes()
      await controller.updateUser(req, res)
      expect(update).toHaveBeenCalledWith({ firstName: 'B' })
      expect(res.status).toHaveBeenCalledWith(202)
      expect(res.json).toHaveBeenCalled()
    })
    it('should return 404 if not found (unhappy)', async () => {
      User.findByPk.mockResolvedValue(null)
      const req = { params: { id: 1 }, body: { firstName: 'B' } }
      const res = mockRes()
      await controller.updateUser(req, res)
      expect(res.status).toHaveBeenCalledWith(404)
      expect(res.json).toHaveBeenCalledWith({ message: 'User not found' })
    })
  })

  describe('deleteUser', () => {
    it('should delete user (happy)', async () => {
      User.destroy.mockResolvedValue(1)
      const req = { params: { id: 1 } }
      const res = mockRes()
      await controller.deleteUser(req, res)
      expect(res.json).toHaveBeenCalledWith({ message: 'User deleted' })
    })
    it('should handle errors (unhappy)', async () => {
      User.destroy.mockRejectedValue(new Error('fail'))
      const req = { params: { id: 1 } }
      const res = mockRes()
      await controller.deleteUser(req, res)
      expect(res.status).toHaveBeenCalledWith(500)
      expect(res.json).toHaveBeenCalledWith({ message: 'fail' })
    })
  })

  describe('login', () => {
    it('should login user (happy)', async () => {
      User.findOne.mockResolvedValue({ id: 1, email: 'a@elpoli.edu.co', password: '$2b$12$test', role: 'student', firstName: 'A' })
      vi.mock('bcrypt', () => ({ default: { compare: vi.fn().mockResolvedValue(true) } }))
      vi.mock('jsonwebtoken', () => ({ default: { sign: () => 'token' } }))
      const req = { body: { email: 'a@elpoli.edu.co', password: '123' } }
      const res = mockRes()
      await controller.login(req, res)
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ token: 'token', email: 'a@elpoli.edu.co' }))
    })
    it('should fail if user not found (unhappy)', async () => {
      User.findOne.mockResolvedValue(null)
      const req = { body: { email: 'a@elpoli.edu.co', password: '123' } }
      const res = mockRes()
      await controller.login(req, res)
      expect(res.status).toHaveBeenCalledWith(400)
      expect(res.json).toHaveBeenCalledWith({ err: 'Email is not registered' })
    })
  })
})
