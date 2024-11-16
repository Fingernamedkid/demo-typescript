import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import fs from "fs";
import path from "path";
import * as crypto from "crypto";
import dotenv from "dotenv";
import { notEqual } from "assert";
import * as winston from "winston";
dotenv.config({ path: "./testing.env" });
import { loadEnvConfig } from "../../config/dotenvconfig";
let certPath = "./src/cert/";
const logger = winston.createLogger({
    level: 'info',
    format: winston.format.combine(
      winston.format.timestamp(),
      winston.format.json()
    ),
    transports: [
      new winston.transports.Console(),
      new winston.transports.File({ filename: 'logs/app.log' })
    ]
  });

const publicKey = fs.readFileSync(path.join(certPath, "public.key"), "utf8");

const secretKey: string = loadEnvConfig().secretKey || "";
const downscaledKey = crypto.createHash("sha256").update(secretKey).digest();
const iv: Buffer = crypto.randomBytes(16);

export function encrypt(text: string): string {
    const cipher = crypto.createCipheriv('aes-256-ctr', downscaledKey, iv);
    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    return encrypted;
}

export function decrypt(encryptedText: string): string {
    const decipher = crypto.createDecipheriv('aes-256-ctr', downscaledKey, iv);
    let decrypted = decipher.update(encryptedText, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
}

export const verifyToken = (req: Request, res: Response, next: NextFunction) => {
    logger.info(`${req.method} ${req.url}`);
    const authHeader = req.headers["authorization"];
    if (!authHeader) {
        return res.status(403).json({ message: "Access denied." });
    }

    try {
        const decryptedToken = decrypt(authHeader); 
        const decoded = jwt.verify(decryptedToken, publicKey, { algorithms: ["RS256"] });
        req.body.user = decoded; notEqual
        next(); 
    } catch (error) {
        console.error("Token verification error:", error);
        logger.error(error);
        return res.status(401).json({ message: "Invalid token." });
    }
};
