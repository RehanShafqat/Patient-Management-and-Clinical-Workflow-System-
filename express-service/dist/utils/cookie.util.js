"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.clearAuthToken = exports.setAuthToken = void 0;
const env_config_1 = require("../config/env.config");
const setAuthToken = (res, accessToken) => {
    res.cookie("accessToken", accessToken, {
        httpOnly: true,
        secure: env_config_1.env.NODE_ENV === "production",
        sameSite: "strict",
        path: "/",
    });
};
exports.setAuthToken = setAuthToken;
const clearAuthToken = (res) => {
    res.clearCookie("accessToken", {
        httpOnly: true,
        secure: env_config_1.env.NODE_ENV === "production",
        sameSite: "strict",
        path: "/",
    });
};
exports.clearAuthToken = clearAuthToken;
//# sourceMappingURL=cookie.util.js.map