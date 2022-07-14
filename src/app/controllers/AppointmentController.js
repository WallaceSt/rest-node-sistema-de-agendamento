import * as Yup from "yup";
import { startOfHour, parseISO, isBefore, format } from "date-fns";
import pt from "date-fns/locale/pt-BR";
import Database from "../../database";
import Notifications from "../schema/Notifications";

const { User, Appointment, File } = Database.models;

class AppointmentController {
  async index(req, res) {
    const { page = 1 } = req.query;

    const appointments = await Appointment.findAll({
      where: {
        user_id: req.userId,
        canceled_at: null,
      },
      order: ["date"],
      attributes: ["id", "date"],
      limit: 20,
      offset: (page - 1) * 20,
      include: [
        {
          model: User,
          as: "collaborator",
          attributes: ["id", "name"],
          include: [
            {
              model: File,
              as: "photo",
              attributes: ["id", "path", "url"],
            },
          ],
        },
      ],
    });

    res.json(appointments);
  }

  async store(req, res) {
    const schema = Yup.object().shape({
      collaborator_id: Yup.number().required(),
      date: Yup.date().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({
        error: "Erro de validação",
      });
    }

    const { collaborator_id, date } = req.body;

    const isCollaborator = await User.findOne({
      where: {
        id: collaborator_id,
        provider: true,
      },
    });

    if (!isCollaborator) {
      return res.status(401).json({
        error: "Colaborador(a) não localizado(a)",
      });
    }

    const startHour = startOfHour(parseISO(date));

    if (isBefore(startHour, new Date())) {
      return res.status(400).json({ error: "Horário não disponível" });
    }

    const checkAvailability = await Appointment.findOne({
      where: {
        collaborator_id,
        canceled_at: null,
        date: startHour,
      },
    });

    if (checkAvailability) {
      return res.status(400).json({
        erro: "Horário não disponível",
      });
    }

    const appointment = await Appointment.create({
      user_id: req.userId,
      collaborator_id,
      date,
    });

    const user = await User.findByPk(req.userId);
    const formattedDate = format(
      startHour,
      "'dia' dd 'de 'MMMM', às' H:mm'h'",
      { locale: pt }
    );

    await Notifications.create({
      content: `Novo agendamento de ${user.name} para ${formattedDate}`,
      user: collaborator_id,
    });

    return res.json(appointment);
  }
}

export default new AppointmentController();
