import Database from "../../database";
import jwt from "jsonwebtoken";

const { User } = Database.connection.models;

class SessionController {
  async store(req, res) {
    const { email, password } = req.body;
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
        token: jwt.sign({ id }, "d14003a82cd66d15cc4a2404a0fb9a8d", {
          expiresIn: "1h",
        }),
      },
    });
  }
}

export default new SessionController();
