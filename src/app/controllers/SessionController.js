import Database from "../../database";
import jwt from "jsonwebtoken";
import authConfig from "../../config/auth";
import * as Yup from 'yup';

const { User } = Database.connection.models;

class SessionController {
  async store(req, res) {
    const { email, password } = req.body;

    const schema = Yup.object().shape({
      email: Yup.string().email().required(),
      password: Yup.string().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({
        error: "Falha na validação",
      });
    }


    const user = await User.findOne({
      where: {
        email,
      },
    });

    if (!user) {
      return res.status(401).json({
        error: "Usuário não encontrado",
      });
    }

    if (!(await user.checkPassword(password))) {
      return res.status(401).json({
        error: "Senha inválida",
      });
    }

    const { id, name } = user;

    return res.json({
      user: {
        id,
        name,
        email,
        token: jwt.sign({ id }, authConfig.secret, {
          expiresIn: authConfig.expiresIn,
        }),
      },
    });
  }
}

export default new SessionController();
