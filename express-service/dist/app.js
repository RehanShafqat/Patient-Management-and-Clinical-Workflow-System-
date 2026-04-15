"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const routes_1 = __importDefault(require("./routes"));
const error_middleware_1 = require("./middlewares/error.middleware");
const env_config_1 = require("./config/env.config");
const app_error_util_1 = require("./utils/app-error.util");
const logger_config_1 = __importDefault(require("./config/logger.config"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const app = (0, express_1.default)();
app.use((0, helmet_1.default)());
app.use((0, cors_1.default)({
    origin: [env_config_1.env.CLIENT_URL],
    credentials: true,
}));
app.use(express_1.default.json());
app.use((0, cookie_parser_1.default)());
//INFO: Request Logger
app.use((req, _res, next) => {
    logger_config_1.default.info(`${req.method} ${req.originalUrl}`);
    next();
});
app.use("/express/check", (req, res, next) => {
    res.json({ message: "You are on express server" });
});
//INFO: Routes
app.use("/api", routes_1.default);
app.use((req, _res, next) => {
    next(new app_error_util_1.AppError(404, `Cannot find ${req.method} ${req.originalUrl}`));
});
app.use(error_middleware_1.errorHandler);
exports.default = app;
//# sourceMappingURL=app.js.map