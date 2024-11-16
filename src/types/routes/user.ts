import express from 'express';
import { userController } from '../controller/userController';
import { sqlInjectionDetector } from '../middleware/sqlInjectionMiddleware';


const userrouter = express.Router();
userrouter.use("/login",sqlInjectionDetector, userController.login);
export default userrouter;