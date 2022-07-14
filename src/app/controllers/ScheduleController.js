import Database from "../../database";

const { User } = Database.models;

class ScheduleController {
  async index(req, res) {
    const { date } = req.query;

    const checkUser = await User.findOne({
      where: {
        id: req.userId,
        provider: true,
      },
    });

    if (!checkUser) {
      return res.status(400).json({
        error: "Usuário não é colaborador.",
      });
    }

    return res.json(checkUser);
  }
}

export default new ScheduleController();
