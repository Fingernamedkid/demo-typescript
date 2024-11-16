import express from 'express';
import { verifyToken } from '../middleware/authMiddleware';
import { roleMiddleware, adminOnly, employeeOrAdmin } from '../middleware/roleMiddleware';
import { ProductController } from '../controller/productControllerV2';
import { sqlInjectionDetector } from '../middleware/sqlInjectionMiddleware';

const v2router = express.Router();

v2router.get(
  "/products",
  verifyToken,
  roleMiddleware(employeeOrAdmin),
  sqlInjectionDetector,
  ProductController.getProducts
);

v2router.post(
  "/products",
  verifyToken,
  roleMiddleware(adminOnly),
  sqlInjectionDetector,
  ProductController.addProduct
);

v2router.put(
  "/products/:id",
  verifyToken,
  roleMiddleware(adminOnly),
  sqlInjectionDetector,
  ProductController.editProduct
);

v2router.delete(
  "/products/:id",
  verifyToken,
  roleMiddleware(adminOnly),
  sqlInjectionDetector,
  ProductController.deleteProduct
);

export default v2router;