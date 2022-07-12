import { Sequelize, DataTypes, Model } from "sequelize";
import { username } from "../../config/database";

const bcrypt = require("bcrypt");

class File extends Model {
    static init(sequelize) {
        super.init({
            name: DataTypes.STRING,
            path: DataTypes.STRING,
        }, {
            sequelize,
        });

        return this;
    }
}

export default File;