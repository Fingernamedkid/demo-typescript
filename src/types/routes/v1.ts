import express, { Request, Response } from 'express';
import { verifyToken } from '../middleware/authMiddleware';

import { ProductController } from '../controller/productControllerV1';
import { Product } from '../model/product';
import { ProductService } from '../services/productServiceV1';
import { roleMiddleware, adminOnly, employeeOrAdmin } from '../middleware/roleMiddleware';
import { sqlInjectionDetector } from '../middleware/sqlInjectionMiddleware';


const v1router = express.Router();

v1router.get(
"/products",
  verifyToken,
  roleMiddleware(employeeOrAdmin),
  sqlInjectionDetector,
  ProductController.getProducts
);

v1router.post(
  "/products",
  verifyToken,
  roleMiddleware(adminOnly),
  sqlInjectionDetector,
  ProductController.addProduct
);
v1router.put(
  "/products/:id",
  verifyToken,
  roleMiddleware(adminOnly),
  sqlInjectionDetector,
  ProductController.editProduct
);


v1router.delete(
  "/products/:id",
  verifyToken,
  roleMiddleware(adminOnly),
  sqlInjectionDetector,
  ProductController.deleteProduct
);

export default v1router;