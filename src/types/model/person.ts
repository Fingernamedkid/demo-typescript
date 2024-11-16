import { PersonI } from "../interface/personInterface";

export class Person implements PersonI {
    
    private static currentMaxId = 0;
    private _id: number= 0;
    private _name: string = "";
    private _email: string = "";
    private _password: string = "";
    private _role: string = "";

    constructor() {
        this._id = Person.currentMaxId++;
    }

    public get id(): number {
        return this._id;
    }

    public get name(): string {
        return this._name;
    }

    public set name(name: string) {
        this._name = name;
    }

    public get email(): string {
        return this._email;
    }

    public set email(email: string) {
        this._email = email;
    }

    public get password(): string {
        return this._password;
    }

    public set password(password: string) {
        this._password = password;
    }
    public get role(): string {
        return this._role;
    }

    public set role(role: string) {
        this._role = role;
    }

    public toJSON(): PersonI {
        return {
            id: this._id,
            name: this._name,
            email: this._email,
            password: this._password,
            role: this._role
        };
    }
    public greet(): string {
        return `Hello, my name is ${this.name} and my email is ${this.email}.`;
    }
}
