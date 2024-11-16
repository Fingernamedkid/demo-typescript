"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const authMiddleware_1 = require("../middleware/authMiddleware");
const productControllerV1_1 = require("../controller/productControllerV1");
const roleMiddleware_1 = require("../middleware/roleMiddleware");
const sqlInjectionMiddleware_1 = require("../middleware/sqlInjectionMiddleware");
const v1router = express_1.default.Router();
v1router.get("/products", authMiddleware_1.verifyToken, (0, roleMiddleware_1.roleMiddleware)(roleMiddleware_1.employeeOrAdmin), sqlInjectionMiddleware_1.sqlInjectionDetector, productControllerV1_1.ProductController.getProducts);
v1router.post("/products", authMiddleware_1.verifyToken, (0, roleMiddleware_1.roleMiddleware)(roleMiddleware_1.adminOnly), sqlInjectionMiddleware_1.sqlInjectionDetector, productControllerV1_1.ProductController.addProduct);
v1router.put("/products/:id", authMiddleware_1.verifyToken, (0, roleMiddleware_1.roleMiddleware)(roleMiddleware_1.adminOnly), sqlInjectionMiddleware_1.sqlInjectionDetector, productControllerV1_1.ProductController.editProduct);
v1router.delete("/products/:id", authMiddleware_1.verifyToken, (0, roleMiddleware_1.roleMiddleware)(roleMiddleware_1.adminOnly), sqlInjectionMiddleware_1.sqlInjectionDetector, productControllerV1_1.ProductController.deleteProduct);
exports.default = v1router;
