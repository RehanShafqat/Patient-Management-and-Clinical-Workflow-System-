"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApiResponse = void 0;
class ApiResponse {
    static send(res, data, message = "", statusCode = 200, links, meta) {
        if (links && meta) {
            res.status(statusCode).json({
                data,
                links,
                meta,
            });
            return;
        }
        res.status(statusCode).json({
            success: true,
            message,
            data,
        });
    }
}
exports.ApiResponse = ApiResponse;
//# sourceMappingURL=api-response.util.js.map