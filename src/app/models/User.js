import { Sequelize, DataTypes, Model } from "sequelize";
import { username } from "../../config/database";

const bcrypt = require("bcrypt");

class User extends Model {
    static init(sequelize) {
        super.init({
            name: DataTypes.STRING,
            email: DataTypes.STRING,
            password: DataTypes.VIRTUAL,
            password_hash: DataTypes.STRING,
            provider: DataTypes.BOOLEAN
        }, {
            sequelize,
        });

        this.addHook('beforeSave', async user => {
            if (user.password) {
                user.password_hash = await bcrypt.hash(user.password, 10);
            }
        });

        return this;
    }
}

export default User;