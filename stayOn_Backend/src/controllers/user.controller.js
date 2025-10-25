import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { Op } from 'sequelize'
import { User } from '../models/user.model.js'
import nodemailer from 'nodemailer'

export class UserController {
  getAllUsers = async (req, res) => {
    try {
      const users = await User.findAll({
        attributes: { exclude: ['password'] }
      })
      res.json(users)
    } catch (error) {
      res.status(500).json({ message: error.message })
    }
  }

  createUser = async (req, res) => {
    try {
      const {
        email,
        password,
        firstName,
        middleName,
        lastName,
        secondLastName,
        major,
        role,
        age
      } = req.body

      if (!email.endsWith('@elpoli.edu.co')) {
        return res
          .status(400)
          .json({ message: 'Email must end with @elpoli.edu.co' })
      }

      const existingUser = await User.findOne({ where: { email } })
      if (existingUser) {
        return res.status(400).json({ message: 'User already exists' })
      }

      const cryptedPassword = await bcrypt.hash(password, 12)

      const newUser = await User.create({
        email,
        password: cryptedPassword,
        firstName,
        middleName,
        lastName,
        secondLastName,
        major,
        role,
        age
      })

      res.status(201).json(newUser)
    } catch (error) {
      res.status(500).json({ message: error.message })
    }
  }

  getUser = async (req, res) => {
    try {
      const { id } = req.params
      const user = await User.findByPk(id, {
        attributes: { exclude: ['password'] }
      })
      if (user) {
        res.json(user)
      } else {
        res.status(404).json({ message: 'User not found' })
      }
    } catch (error) {
      res.status(500).json({ message: error.message })
    }
  }

  updateUser = async (req, res) => {
    try {
      const { id } = req.params
      const user = await User.findByPk(id)
      if (!user) {
        return res.status(404).json({ message: 'User not found' })
      }

      if (req.body.password) {
        req.body.password = await bcrypt.hash(req.body.password, 12)
      }

      await user.update(req.body)
      res.status(202).json(user)
    } catch (error) {
      res.status(500).json({ message: error.message })
    }
  }

  deleteUser = async (req, res) => {
    try {
      const { id } = req.params
      await User.destroy({ where: { id } })
      res.json({ message: 'User deleted' })
    } catch (error) {
      res.status(500).json({ message: error.message })
    }
  }

  login = async (req, res) => {
    try {
      const { email, password } = req.body
      const user = await User.findOne({
        where: {
          email: {
            [Op.iLike]: email
          }
        }
      })

      if (!user) {
        return res.status(400).json({ err: 'Email is not registered' })
      }

      const passwordMatch = await bcrypt.compare(password, user.password)
      if (!passwordMatch) {
        return res.status(401).json({ err: 'Password incorrect' })
      }
      const token = jwt.sign(
        {
          email: user.email,
          role: user.role,
          id: user.id
        },
        process.env.SECRET_KEY ?? 'LOLOMANSOLO',
        { expiresIn: '2h' }
      )

      res.json({
        token,
        role: user.role,
        email: user.email,
        id: user.id,
        firstName: user.firstName
      })
    } catch (error) {
      res.status(500).json({ message: error.message })
    }
  }

  requestPasswordreset = async (req, res) => {
    try {
      const { email } = req.body
      const user = await User.findOne({ where: { email } })
      if (!user) {
        return res.status(404).json({ message: 'User not found' })
      }

      const token = jwt.sign(
        { email: user.email, id: user.id },
        process.env.RESET_KEY ?? 'LOLOMANSOLO2',
        {
          expiresIn: '1h'
        }
      )

      const resetLink = `http://localhost:4200/reset-password?token=${token}`

      await sendEmail(
        email,
        'Password Reset Request',
        `<body style="margin: 0; padding: 0; background-color: #194866; font-family: Arial, sans-serif; color: white;">
          <div style="max-width: 500px; margin: 40px auto; background-color: #253046; padding: 40px; border-radius: 10px; text-align: center;">
            <h1 style="color: #f3a32f; font-size: 36px; margin-bottom: 20px;">StayOn</h1>
            <p style="font-size: 18px; margin-bottom: 30px; color: white;">
              You requested a password reset. Click the button below to reset your password:
            </p>
            <a href="${resetLink}" style="display: inline-block; background-color: #007bff; color: white; text-decoration: none; 
              padding: 12px 24px; border-radius: 5px; font-weight: bold;">
              Reset Password
            </a>
          </div>
        </body>`
      )

      res.json({ message: 'Password reset link sent to youar email' })
    } catch (error) {
      res.status(500).json({ message: error.message })
    }
  }

  changePassword = async (req, res) => {
    try {
      const { token, newPassword } = req.body
      const decoded = jwt.verify(
        token,
        process.env.RESET_KEY ?? 'LOLOMANSOLO2'
      )
      const user = await User.findOne({ where: { email: decoded.email } })

      if (!user) {
        return res.status(400).json({ messaage: 'invalid or expired token' })
      }

      user.password = await bcrypt.hash(newPassword, 10)
      await user.save()

      res.status(200).json({ message: 'Password changed successfully' })
    } catch (error) {
      res.status(500).json({ message: error.message })
    }
  }
}

async function sendEmail (to, subject, html) {
  const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
      user: 'juanjo.jjev@gmail.com',
      pass: 'rhxs cmcb nbzg onuf'
    }
  })

  await transporter.sendMail({
    from: '"StayOn" <no-reply@StayOn.com>',
    to,
    subject,
    html
  })
}
