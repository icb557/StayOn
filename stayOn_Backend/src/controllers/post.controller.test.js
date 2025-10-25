import { describe, it, expect, beforeEach, vi } from 'vitest'
import { PostController } from './post.controller.js'

import { Post } from '../models/post.model.js'
import { Material } from '../models/material.model.js'

vi.mock('bcrypt', () => ({
  default: {
    hash: vi.fn().mockResolvedValue('hashedpassword'),
    compare: vi.fn()
  }
}))

vi.mock('../models/post.model.js', () => ({ Post: { findAll: vi.fn(), findByPk: vi.fn(), create: vi.fn(), destroy: vi.fn() } }))
vi.mock('../models/user.model.js', () => ({ User: {} }))
vi.mock('../models/comment.model.js', () => ({ Comment: {} }))
vi.mock('../models/material.model.js', () => ({ Material: { bulkCreate: vi.fn() } }))
vi.mock('../models/topic.model.js', () => ({ Topic: {} }))

function mockRes () {
  return {
    json: vi.fn(),
    status: vi.fn().mockReturnThis(),
    send: vi.fn()
  }
}

describe('PostController', () => {
  let controller
  beforeEach(() => {
    controller = new PostController()
    vi.clearAllMocks()
  })

  describe('getAllPosts', () => {
    it('should return all posts (happy)', async () => {
      Post.findAll.mockResolvedValue([{ id: 1, message: 'hi' }])
      const res = mockRes()
      await controller.getAllPosts({}, res)
      expect(res.json).toHaveBeenCalledWith([{ id: 1, message: 'hi' }])
    })
    it('should handle errors (unhappy)', async () => {
      Post.findAll.mockRejectedValue(new Error('fail'))
      const res = mockRes()
      await controller.getAllPosts({}, res)
      expect(res.status).toHaveBeenCalledWith(500)
      expect(res.json).toHaveBeenCalledWith({ message: 'fail' })
    })
  })

  describe('createPost', () => {
    it('should create post and materials (happy)', async () => {
      Post.create.mockResolvedValue({ id: 1 })
      Material.bulkCreate.mockResolvedValue([])
      const req = { body: { message: 'hi', topicId: 1, userId: 1 }, files: [{ originalname: 'file.txt', filename: 'file.txt', mimetype: 'text/plain' }] }
      const res = mockRes()
      await controller.createPost(req, res)
      expect(Post.create).toHaveBeenCalled()
      expect(Material.bulkCreate).toHaveBeenCalled()
      expect(res.status).toHaveBeenCalledWith(201)
      expect(res.json).toHaveBeenCalledWith({ message: 'Post created succefully' })
    })
    // it('should handle errors (unhappy)', async () => {
    //   Post.create.mockRejectedValue(new Error('fail'))
    //   const req = { body: { message: 'hi', topicId: 1, userId: 1 }, files: [] }
    //   const res = mockRes()
    //   await controller.createPost(req, res)
    //   expect(res.status).toHaveBeenCalledWith(500)
    //   expect(res.json).toHaveBeenCalledWith({ error: 'Error creating Post' })
    // })
  })

  describe('getPostById', () => {
    it('should return post by id (happy)', async () => {
      Post.findByPk.mockResolvedValue({ id: 1, message: 'hi' })
      const req = { params: { id: 1 } }
      const res = mockRes()
      await controller.getPostById(req, res)
      expect(res.json).toHaveBeenCalledWith({ id: 1, message: 'hi' })
    })
    it('should return 404 if not found (unhappy)', async () => {
      Post.findByPk.mockResolvedValue(null)
      const req = { params: { id: 1 } }
      const res = mockRes()
      await controller.getPostById(req, res)
      expect(res.status).toHaveBeenCalledWith(404)
      expect(res.json).toHaveBeenCalledWith({ err: 'post not found' })
    })
  })

  describe('getPostsByUser', () => {
    it('should return posts for user (happy)', async () => {
      Post.findAll.mockResolvedValue([{ id: 1, userId: 1 }])
      const req = { params: { userId: 1 } }
      const res = mockRes()
      await controller.getPostsByUser(req, res)
      expect(res.json).toHaveBeenCalledWith([{ id: 1, userId: 1 }])
    })
    it('should return 404 if no posts (unhappy)', async () => {
      Post.findAll.mockResolvedValue([])
      const req = { params: { userId: 1 } }
      const res = mockRes()
      await controller.getPostsByUser(req, res)
      expect(res.status).toHaveBeenCalledWith(404)
      expect(res.json).toHaveBeenCalledWith({ err: 'posts not found for this user' })
    })
  })

  describe('deletePost', () => {
    it('should delete post (happy)', async () => {
      Post.destroy.mockResolvedValue(1)
      const req = { params: { id: 1 } }
      const res = mockRes()
      await controller.deletePost(req, res)
      expect(res.status).toHaveBeenCalledWith(200)
      expect(res.json).toHaveBeenCalledWith({ message: 'Post deleted successfully', forUser: true })
    })
    it('should return 404 if not found (unhappy)', async () => {
      Post.destroy.mockResolvedValue(0)
      const req = { params: { id: 1 } }
      const res = mockRes()
      await controller.deletePost(req, res)
      expect(res.status).toHaveBeenCalledWith(404)
      expect(res.json).toHaveBeenCalledWith({ message: 'Post does not exist', text: 'The post you are trying to delete does not exists', forUser: true })
    })
  })

  describe('updatePost', () => {
    it('should update post (happy)', async () => {
      const save = vi.fn()
      const set = vi.fn()
      Post.findByPk.mockResolvedValue({ set, save })
      const req = { params: { id: 1 }, body: { message: 'new', topicId: 2 } }
      const res = mockRes()
      await controller.updatePost(req, res)
      expect(set).toHaveBeenCalledWith({ message: 'new', topicId: 2 })
      expect(save).toHaveBeenCalled()
      expect(res.status).toHaveBeenCalledWith(200)
      expect(res.json).toHaveBeenCalledWith({ message: 'new', topicId: 2 })
    })
    it('should return 404 if not found (unhappy)', async () => {
      Post.findByPk.mockResolvedValue(null)
      const req = { params: { id: 1 }, body: { message: 'new', topicId: 2 } }
      const res = mockRes()
      await controller.updatePost(req, res)
      expect(res.status).toHaveBeenCalledWith(404)
      expect(res.json).toHaveBeenCalledWith({ message: 'Post does not exist', text: 'The post you are trying to update does not exists', forUser: true })
    })
  })
})
