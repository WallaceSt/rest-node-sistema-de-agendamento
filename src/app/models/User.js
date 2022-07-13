import { DataTypes, Model } from "sequelize";
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

    static associate(models) {
        this.belongsTo(models.File, { foreignKey: 'photo_id', as: 'photo' });
    }

    checkPassword(password) {
        return bcrypt.compare(password, this.password_hash);
    }
}

export default User;