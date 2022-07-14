import * as Yup from "yup";
import Database from "../../database";

const { User } = Database.models;

class UserController {
  async store(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      email: Yup.string().email().required(),
      password: Yup.string().required().min(6),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({
        error: "Falha na validação",
      });
    }

    const userExists = await User.findOne({
      where: {
        email: req.body.email,
      },
    });

    if (userExists) {
      return res.status(400).json({ error: "Usuário já cadastrado" });
    }
    const { id, name, email, password, provider } = req.body;
    const user = await User.create(req.body);
    return res.json({
      id,
      name,
      email,
      password,
      provider,
    });
  }

  async update(req, res) {
    const user = await User.findByPk(req.userId);
    const { name, email, oldPassword, password, provider } = req.body;

    if (!user) {
      return res.status(401).json({
        error: "Usuário não encontrado",
      });
    }

    if (email && email !== user.email) {
      const userExists = await User.findOne({
        where: {
          email,
        },
      });

      if (userExists) {
        return res.status(400).json({ error: "Usuário já cadastrado" });
      }
    }

    const schema = Yup.object().shape({
      name: Yup.string(),
      email: Yup.string().email(),
      oldPassword: Yup.string().min(6),
      password: Yup.string()
        .min(6)
        .when("oldPassword", (oldPassword, field) =>
          oldPassword ? field.required() : field
        ),
      confirmPassword: Yup.string().when("password", (password, field) =>
        password ? field.required().oneOf([Yup.ref("password")]) : field
      ),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({
        error: "Falha na validação",
      });
    }

    if (oldPassword && !(await user.checkPassword(oldPassword))) {
      return res.status(401).json({ error: "Senha não confere" });
    }

    user.update(req.body);

    return res.json({
      name: user.name,
      email: user.email,
      provider: user.provider,
    });
  }

  async delete(req, res) {
    const user = await User.findByPk(req.userId);

    if (!user) {
      return res.status(401).json({
        error: "Usuário não encontrado",
      });
    }

    user.destroy();

    return res.json({
      message: "Usuário deletado",
    });
  }
}

export default new UserController();
