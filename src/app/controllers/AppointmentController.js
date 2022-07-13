import * as Yup from "yup";
import Database from "../../database";

const { User, Appointment } = Database.connection.models;

class AppointmentController {
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
        collaborator_id,
        provider: true,
      },
    });

    if (!isCollaborator) {
      return res.status(401).json({
        error: "Colaborador(a) não localizado(a)"
      })
    }

    const appointment = await Appointment.create({
      user_id: req.userId,
      collaborator_id,
      date
    })

    return res.json(appointment);
  }
}

export default new AppointmentController();
