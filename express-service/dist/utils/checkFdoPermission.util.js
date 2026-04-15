"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkFdoHasPermission = void 0;
const checkFdoHasPermission = (user, permission) => {
    return user.isPermissionAllowed([permission]);
};
exports.checkFdoHasPermission = checkFdoHasPermission;
//# sourceMappingURL=checkFdoPermission.util.js.map