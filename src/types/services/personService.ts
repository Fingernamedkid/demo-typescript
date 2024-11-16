import { compareSync, hash } from 'bcryptjs';
import { Person } from '../model/person'; 
import { PersonI } from '../interface/personInterface';
import fs from "fs";
import { loadEnvConfig } from '../../config/dotenvconfig';

const persons: PersonI[] = [];
try {
    const data = fs.readFileSync("./login.json", 'utf-8');
    persons.push(... JSON.parse(data));
  } catch (error) {
    console.error(error);
  
    throw error;
  }
  
const saltRounds: string= loadEnvConfig().saltRound || "0";

export class PersonService {
    public static listPersons(): PersonI[] {
        return persons;
    }

    public static async addPerson(newPerson:Person): Promise<boolean> {
        if (newPerson){
            newPerson.password = await hash(newPerson.password, Number(saltRounds));
            persons.push(newPerson);
            return true;
        }
        return false;
    }

    public static async verifyUser( email: string, password: string): Promise<[boolean, PersonI]> {

        for (const person  of persons) {
            if (person.email === email && /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/.test(email)) {
                let foundUser = person
                if ( compareSync(password, foundUser.password)) {
                    return [true,foundUser];
                }
            } 
        }
        return [false, new Person()];
    }
}
