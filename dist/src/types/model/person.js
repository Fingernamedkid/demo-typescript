"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Person = void 0;
class Person {
    constructor() {
        this._id = 0;
        this._name = "";
        this._email = "";
        this._password = "";
        this._role = "";
        this._id = Person.currentMaxId++;
    }
    get id() {
        return this._id;
    }
    get name() {
        return this._name;
    }
    set name(name) {
        this._name = name;
    }
    get email() {
        return this._email;
    }
    set email(email) {
        this._email = email;
    }
    get password() {
        return this._password;
    }
    set password(password) {
        this._password = password;
    }
    get role() {
        return this._role;
    }
    set role(role) {
        this._role = role;
    }
    toJSON() {
        return {
            id: this._id,
            name: this._name,
            email: this._email,
            password: this._password,
            role: this._role
        };
    }
    greet() {
        return `Hello, my name is ${this.name} and my email is ${this.email}.`;
    }
}
exports.Person = Person;
Person.currentMaxId = 0;
