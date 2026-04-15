"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = __importDefault(require("./app"));
const database_config_1 = require("./config/database.config");
const env_config_1 = require("./config/env.config");
const logger_config_1 = __importDefault(require("./config/logger.config"));
require("./types");
require("./models");
const startServer = async () => {
    await (0, database_config_1.connectDB)();
    app_1.default.listen(env_config_1.env.PORT, () => {
        logger_config_1.default.info(`Server running on http://localhost:${env_config_1.env.PORT}`);
        logger_config_1.default.info(`Environment: ${env_config_1.env.NODE_ENV}`);
    });
};
startServer();
//# sourceMappingURL=server.js.map