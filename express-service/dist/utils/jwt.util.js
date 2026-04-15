"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createJwtToken = exports.verifyJwtToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const verifyJwtToken = (token, secret) => {
    return jsonwebtoken_1.default.verify(token, secret);
};
exports.verifyJwtToken = verifyJwtToken;
const createJwtToken = (userId, role, secret, expiresIn) => {
    const options = { expiresIn };
    return jsonwebtoken_1.default.sign({ userId, role }, secret, options);
};
exports.createJwtToken = createJwtToken;
//# sourceMappingURL=jwt.util.js.map