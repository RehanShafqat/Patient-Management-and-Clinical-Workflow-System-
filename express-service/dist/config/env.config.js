"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.env = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
exports.env = {
    PORT: Number(process.env.PORT),
    NODE_ENV: process.env.NODE_ENV,
    CLIENT_URL: process.env.CLIENT_URL,
    DB_HOST: process.env.DB_HOST,
    DB_PORT: Number(process.env.DB_PORT),
    DB_NAME: process.env.DB_NAME ?? "",
    DB_USER: process.env.DB_USER ?? "",
    DB_PASSWORD: process.env.DB_PASSWORD ?? "",
    JWT_SECRET: process.env.JWT_SECRET ?? "",
    JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN ?? "7d",
};
//# sourceMappingURL=env.config.js.map