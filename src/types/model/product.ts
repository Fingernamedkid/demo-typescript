import { ProductI } from "../interface/productInterface";
import { rating } from "../interface/rating";

export class Product implements ProductI {
    
    private static currentMaxId = 0; 
    public _id: number=0;              
    private _title: string = "";
    private _description: string = "";
    private _category: string = "";
    private _stock: number = 0.0;       
    private _price: number = 0;         
    private _image: string ="";
    private _rating: { rate: number, count: number } = {rate:0.0, count:0};
    
    constructor(id: number, title: string, description: string, category: string, stock: number, price: number, image: string, rating: rating) {
        this._id = id;
        this._title = title;
        this._description = description;
        this._category = category;
        this._stock = stock;
        this._price = price;
        this._image = image;
        this._rating = rating;
    }

    public get id(): number {
        return this._id; 
    }

    
    public get title(): string {
        return this._title; 
    }
    
    public set title(title: string) {
        this._title = title;
    }

    public set description(description: string) {
        this._description = description;
    }

    public get description(): string {
        return this._description; 
    }
    
    public get category(): string {
        return this._category; 
    }
    
    public set category(category: string) {
        this._category = category;
    }
    public get stock(): number {
        return this._stock; 
    }

    public set stock(stock: number) {
        this._stock = stock;
    }
    public get price(): number {
        return this._price; 
    }

    public set price(price: number) {
        this._price = price;
    }
    public get image(): string {
        return this._image; 
    }

    public set image(image: string) {
        this._image = image;
    }
    public get rating(): rating {
        return this._rating; 
    }

    public set rating(rating: rating) {
        this._rating = rating;
    }
    public toJSON(): ProductI {
        return {
            _id: this._id,
            title: this._title,
            price: this._price,
            description: this._description,
            category: this._category,
            image: this._image,
            rating: this._rating,
            stock: this._stock
        };
    }
    public static setMaxid(id: number) : void{
        this.currentMaxId = id
    }
}