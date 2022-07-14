import Database from "../../database";
import Notifications from "../schema/Notifications";

const { User } = Database.models;

class NotificationController {
  async index(req, res) {
    const checkIsCollaborator = await User.findOne({
      where: {
        id: req.userId,
        provider: true,
      },
    });

    if (!checkIsCollaborator) {
      return res.status(401).json({
        error: "Notificação disponível apenas para colaboradores.",
      });
    }

    const notifications = await Notifications.find({
      user: req.userId,
    })
      .sort({ createdAt: "desc" })
      .limit(20);

    return res.json(notifications);
  }

  async update(req, res) {
    const notification = await Notifications.findByIdAndUpdate(
      req.params.id,
      {
        read: true,
      },
      { new: true }
    );

    return res.json(notification);
  }
}

export default new NotificationController();
