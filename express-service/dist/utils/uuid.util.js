"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isValidUUID = void 0;
const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const isValidUUID = (id) => UUID_REGEX.test(id);
exports.isValidUUID = isValidUUID;
//# sourceMappingURL=uuid.util.js.map