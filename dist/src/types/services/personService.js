"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PersonService = void 0;
const bcryptjs_1 = require("bcryptjs");
const person_1 = require("../model/person");
const fs_1 = __importDefault(require("fs"));
const dotenvconfig_1 = require("../../config/dotenvconfig");
const __1 = require("../..");
const persons = [];
try {
    const data = fs_1.default.readFileSync("./login.json", 'utf-8');
    persons.push(...JSON.parse(data));
}
catch (error) {
    console.error(error);
    throw error;
}
const saltRounds = (0, dotenvconfig_1.loadEnvConfig)(__1.setting).saltRound || "0";
class PersonService {
    static listPersons() {
        return persons;
    }
    static async addPerson(newPerson) {
        if (newPerson) {
            newPerson.password = await (0, bcryptjs_1.hash)(newPerson.password, Number(saltRounds));
            persons.push(newPerson);
            return true;
        }
        return false;
    }
    static async verifyUser(email, password) {
        for (const person of persons) {
            if (person.email === email && /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/.test(email)) {
                let foundUser = person;
                if ((0, bcryptjs_1.compareSync)(password, foundUser.password)) {
                    return [true, foundUser];
                }
            }
        }
        return [false, new person_1.Person()];
    }
}
exports.PersonService = PersonService;
