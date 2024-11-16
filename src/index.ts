import express, { Request, Response } from "express";
import path from "path";
import https from "https";
import userrouter from "./types/routes/user";
import swaggerJSDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import v1router from "./types/routes/v1";
import v2router from "./types/routes/v2";
import * as fs from "fs";
import { initLs } from './types/services/productServiceV2';
import {loadEnvConfig} from './config/dotenvconfig';

let certPath = "./src/cert/";
const options = {
  key: fs.readFileSync(path.join(certPath, "key.pem")),
  cert: fs.readFileSync(path.join(certPath, "cert.pem")),
};
async function load() {
  
  await initLs();
}
load();
  const app = express();
  const port = 3020;
  loadEnvConfig();
  app.use(express.json());
  app.use('/v1', v1router);
  app.use('/v2', v2router);
  app.use('/', v1router);

  app.get("/", (req: Request, res: Response) => {
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

  const swaggerDocs = swaggerJSDoc(swaggerOptions);
  app.use("/v1", swaggerUi.serve, swaggerUi.setup(swaggerDocs));

  app.use("/users", userrouter);

  const server = https.createServer(options, app).listen(port, () => {
    console.log(`Serveur HTTPS en écoute sur <https://localhost>:${port}`);
  });
  export {  app,server };
