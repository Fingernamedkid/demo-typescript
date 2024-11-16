"use strict";
var _a, _b;
Object.defineProperty(exports, "__esModule", { value: true });
exports.employeeOrAdmin = exports.adminOnly = void 0;
exports.roleMiddleware = roleMiddleware;
const dotenvconfig_1 = require("../../config/dotenvconfig");
const __1 = require("../..");
function roleMiddleware(roles) {
    return (req, res, next) => {
        var _a;
        const userRole = (_a = req.body.user) === null || _a === void 0 ? void 0 : _a.role;
        if (!roles.includes(userRole)) {
            return res.status(403).json({ message: 'Accès interdit.' });
        }
        next();
    };
}
exports.adminOnly = ((_a = (0, dotenvconfig_1.loadEnvConfig)(__1.setting).admin) === null || _a === void 0 ? void 0 : _a.split(',')) || [];
exports.employeeOrAdmin = ((_b = (0, dotenvconfig_1.loadEnvConfig)(__1.setting).all) === null || _b === void 0 ? void 0 : _b.split(',')) || [];
