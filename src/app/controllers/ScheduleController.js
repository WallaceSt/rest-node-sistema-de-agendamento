import Database from "../../database";
import Appointment from "../models/Appointment";
import { Op } from "sequelize";
import { endOfDay, parseISO, startOfDay } from "date-fns";

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
    console.log(date);
    const parseDate = parseISO(date);

    const appointments = await Appointment.findAll({
      where: {
        collaborator_id: req.userId,
        canceled_at: null,
        date: {
          [Op.between]: [startOfDay(parseDate), endOfDay(parseDate)]
        }
      },
      order: ['date']
    });

    if (!appointments) {
      return res.status(400).json({
        error: "Nenhum serviço foi encontrado na agenda para este período"
      });
    }

    return res.json(appointments);
  }
}

export default new ScheduleController();
