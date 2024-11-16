"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const userController_1 = require("../controller/userController");
const sqlInjectionMiddleware_1 = require("../middleware/sqlInjectionMiddleware");
const userrouter = express_1.default.Router();
userrouter.use("/login", sqlInjectionMiddleware_1.sqlInjectionDetector, userController_1.userController.login);
exports.default = userrouter;
