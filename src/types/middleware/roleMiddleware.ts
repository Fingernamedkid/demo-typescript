import { Request, Response, NextFunction } from 'express';
import dotenv from 'dotenv';
import { loadEnvConfig } from '../../config/dotenvconfig';



export function roleMiddleware(roles: string[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    const userRole = req.body.user?.role;
    if (!roles.includes(userRole)) {
      return res.status(403).json({ message: 'Accès interdit.' });
    }
    next();
  };
}

export const adminOnly: string[] = loadEnvConfig().admin?.split(',') || [];
export const employeeOrAdmin: string[] = loadEnvConfig().all?.split(',') || [];
