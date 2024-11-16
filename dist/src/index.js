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
exports.setting = void 0;
const express_1 = __importDefault(require("express"));
const path_1 = __importDefault(require("path"));
const https_1 = __importDefault(require("https"));
const user_1 = __importDefault(require("./types/routes/user"));
const swagger_jsdoc_1 = __importDefault(require("swagger-jsdoc"));
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const v1_1 = __importDefault(require("./types/routes/v1"));
const v2_1 = __importDefault(require("./types/routes/v2"));
const fs = __importStar(require("fs"));
const productServiceV2_1 = require("./types/services/productServiceV2");
const dotenvconfig_1 = require("./config/dotenvconfig");
let certPath = "./src/cert/";
const options = {
    key: fs.readFileSync(path_1.default.join(certPath, "key.pem")),
    cert: fs.readFileSync(path_1.default.join(certPath, "cert.pem")),
};
exports.setting = "production";
async function load() {
    await (0, productServiceV2_1.initLs)();
}
load();
const app = (0, express_1.default)();
const port = 3020;
(0, dotenvconfig_1.loadEnvConfig)("production");
app.use(express_1.default.json());
app.use('/v1', v1_1.default);
app.use('/v2', v2_1.default);
app.use('/', v2_1.default);
app.get("/", (req, res) => {
    res.send("Hello TypeScript with Express!");
});
const swaggerOptions = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'User API',
            version: '1.0.0',
            description: 'A simple API to manage users',
        },
    },
    apis: ["./src/types/route/swaggerroute.ts"],
};
const swaggerDocs = (0, swagger_jsdoc_1.default)(swaggerOptions);
app.use("/v1", swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(swaggerDocs));
app.use("/users", user_1.default);
https_1.default.createServer(options, app).listen(port, () => {
    console.log(`Serveur HTTPS en écoute sur <https://localhost>:${port}`);
});
exports.default = app;
