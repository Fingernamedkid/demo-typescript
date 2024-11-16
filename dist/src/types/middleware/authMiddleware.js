"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyToken = void 0;
exports.encrypt = encrypt;
exports.decrypt = decrypt;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const crypto = __importStar(require("crypto"));
const dotenv_1 = __importDefault(require("dotenv"));
const assert_1 = require("assert");
const winston = __importStar(require("winston"));
dotenv_1.default.config({ path: "./testing.env" });
const dotenvconfig_1 = require("../../config/dotenvconfig");
const __1 = require("../..");
let certPath = "./src/cert/";
const logger = winston.createLogger({
    level: 'info',
    format: winston.format.combine(winston.format.timestamp(), winston.format.json()),
    transports: [
        new winston.transports.Console(),
        new winston.transports.File({ filename: 'logs/app.log' })
    ]
});
const publicKey = fs_1.default.readFileSync(path_1.default.join(certPath, "public.key"), "utf8");
const secretKey = (0, dotenvconfig_1.loadEnvConfig)(__1.setting).secretKey || "";
const downscaledKey = crypto.createHash("sha256").update(secretKey).digest();
const iv = crypto.randomBytes(16);
function encrypt(text) {
    const cipher = crypto.createCipheriv('aes-256-ctr', downscaledKey, iv);
    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    return encrypted;
}
function decrypt(encryptedText) {
    const decipher = crypto.createDecipheriv('aes-256-ctr', downscaledKey, iv);
    let decrypted = decipher.update(encryptedText, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
}
const verifyToken = (req, res, next) => {
    logger.info(`${req.method} ${req.url}`);
    const authHeader = req.headers["authorization"];
    if (!authHeader) {
        return res.status(403).json({ message: "Access denied." });
    }
    try {
        const decryptedToken = decrypt(authHeader);
        const decoded = jsonwebtoken_1.default.verify(decryptedToken, publicKey, { algorithms: ["RS256"] });
        req.body.user = decoded;
        assert_1.notEqual;
        next();
    }
    catch (error) {
        console.error("Token verification error:", error);
        logger.error(error);
        return res.status(401).json({ message: "Invalid token." });
    }
};
exports.verifyToken = verifyToken;
