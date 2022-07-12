import Database from "../../database";

const { User } = Database.connection.models;

class UserController {
  async store(req, res) {
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

    const { name, email, password, provider } = req.body;

    if (!user) {
      return res.status(401).json({
        error: "Usuário não encontrado",
      });
    }

    user.update({
      name,
      email,
      password,
      provider,
    });

    return res.json({
      name: user.name,
      email: user.email,
      provider: user.provider,
    });
  }
}

export default new UserController();
