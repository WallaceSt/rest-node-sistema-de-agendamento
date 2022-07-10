import Database from "../../database";

const { User } = Database.connection.models;

class UserController {
    async store(req, res) {
        const userExists = await User.findOne({
            where: {
                email: req.body.email
            }
        })

        if (userExists) {
            return res.status(400).json({ "error": "Usuário já cadastrado" });
        }
        const { id, name, email, password, provider } = req.body;
        const user = await User.create(req.body)
        return res.json({
            id,
            name,
            email,
            password,
            provider
        })
    }
}

export default new UserController();