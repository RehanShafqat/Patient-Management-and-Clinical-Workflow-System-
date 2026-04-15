"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectDB = void 0;
const sequelize_1 = require("sequelize");
const logger_config_1 = __importDefault(require("./logger.config"));
const dotenv_1 = __importDefault(require("dotenv"));
const index_1 = require("../models/index");
dotenv_1.default.config();
const sequelize = new sequelize_1.Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    dialect: 'mysql',
    logging: process.env.NODE_ENV === 'development'
        ? (msg) => logger_config_1.default.debug(msg)
        : false,
    pool: {
        max: 10,
        min: 2,
        acquire: 30000,
        idle: 10000,
    },
});
//INFO: Initializes all model schemas and associations against this Sequelize instance
(0, index_1.initModels)(sequelize);
const connectDB = async () => {
    try {
        await sequelize.authenticate();
        logger_config_1.default.info('Database connected successfully.');
        //INFO: No sync — Laravel owns all migrations
        logger_config_1.default.info('Models loaded successfully.');
    }
    catch (error) {
        logger_config_1.default.error(`Unable to connect to the database: ${error}`);
        process.exit(1);
    }
};
exports.connectDB = connectDB;
exports.default = sequelize;
//# sourceMappingURL=database.config.js.map