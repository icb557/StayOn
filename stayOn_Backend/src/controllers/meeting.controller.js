import { Meeting } from "../models/meeting.model.js";
import { User } from "../models/user.model.js";

export class MeetingController {
  static async getAllMeetings(req, res) {
    try {
      const meetings = await Meeting.findAll({
        include: [{ model: User }],
      });
      res.json(meetings);
    } catch (error) {
      console.error("Error fetching meetings:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  }

  static async getMeeting(req, res) {
    try {
      const { id } = req.params;
      const meeting = await Meeting.findByPk(id, {
        include: [{ model: User }],
      });
      if (!meeting) {
        return res.status(404).json({ message: "Meeting not found" });
      }
      res.json(meeting);
    } catch (error) {
      console.error("Error fetching meeting:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  }

  static async createMeeting(req, res) {
    try {
      const {
        title,
        description,
        url,
        userId,
        fechaReunion,
        activa = true,
      } = req.body;

      // Validación básica
      if (!title || !description || !url || !userId || !fechaReunion) {
        return res.status(400).json({ message: "Missing required fields" });
      }

      if (!/^https?:\/\/.+$/.test(url)) {
        return res.status(400).json({ message: "Invalid URL format" });
      }

      const user = await User.findByPk(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      const meeting = await Meeting.create({
        title,
        description,
        url,
        userId,
        fechaReunion,
        activa,
      });

      const createdMeeting = await Meeting.findByPk(meeting.id, {
        include: [{ model: User }],
      });

      res.status(201).json(createdMeeting);
    } catch (error) {
      console.error("Error creating meeting:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  }

  static async updateMeeting(req, res) {
    try {
      const { id } = req.params;
      const meeting = await Meeting.findByPk(id);

      if (!meeting) {
        return res.status(404).json({ message: "Meeting not found" });
      }

      // Evitar actualización de campos protegidos
      const { id: _, userId: __, ...updateFields } = req.body;

      await meeting.update(updateFields);

      const updatedMeeting = await Meeting.findByPk(id, {
        include: [{ model: User }],
      });

      res.status(200).json(updatedMeeting);
    } catch (error) {
      console.error("Error updating meeting:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  }

  static async deleteMeeting(req, res) {
    try {
      const { id } = req.params;
      const deleted = await Meeting.destroy({ where: { id } });

      if (!deleted) {
        return res.status(404).json({ message: "Meeting not found" });
      }

      res.json({ message: "Meeting deleted" });
    } catch (error) {
      console.error("Error deleting meeting:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  }

  static async getMeetingsByUser(req, res) {
    try {
      const { userId } = req.params;
      const meetings = await Meeting.findAll({
        where: { userId },
        include: [{ model: User }],
      });
      res.json(meetings);
    } catch (error) {
      console.error("Error fetching meetings by user:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  }

  static async getActiveMeetings(req, res) {
    try {
      const meetings = await Meeting.findAll({
        where: { activa: true },
        include: [{ model: User }],
      });
      res.json(meetings);
    } catch (error) {
      console.error("Error fetching active meetings:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  }

  static async deactivateMeeting(req, res) {
    try {
      const { id } = req.params;
      const meeting = await Meeting.findByPk(id);

      if (!meeting) {
        return res.status(404).json({ message: "Meeting not found" });
      }

      meeting.activa = false;
      await meeting.save();

      res.json({ message: "Meeting deactivated successfully" });
    } catch (error) {
      console.error("Error deactivating meeting:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  }
}
