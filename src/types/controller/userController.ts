
import { Request, Response } from 'express';
import { PersonService } from "../services/personService";
import { sign } from "jsonwebtoken";
import { encrypt } from '../middleware/authMiddleware';
import * as fs from "fs";
import path from 'path';





let certPath = "./src/cert/";

const privateKey = fs.readFileSync(path.join(certPath, "private.key"), "utf8");
export class userController{
    static async login (req: Request, res: Response) {
        try {
          const { email, password } = req.body;
          await PersonService.verifyUser(email, password).then((respon) => {
            if (respon[0]) {
              const accessToken = sign(
                { email: respon[1].email, role: respon[1].role },
                privateKey,
                { algorithm: "RS256", expiresIn: "1h" }
              );
              console.log(accessToken);
              const betterToken = encrypt(accessToken);
              res.status(200).json({ betterToken });
            } else {
              res.status(401).json({ message: "Login Invalid" });
            }
          });
        } catch (error) {
          console.log(error);
          res.status(500).json({ message: "Internal Issue" });
        }
      }
}