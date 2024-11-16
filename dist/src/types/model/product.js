"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Product = void 0;
class Product {
    constructor(id, title, description, category, stock, price, image, rating) {
        this._id = 0;
        this._title = "";
        this._description = "";
        this._category = "";
        this._stock = 0.0;
        this._price = 0;
        this._image = "";
        this._rating = { rate: 0.0, count: 0 };
        this._id = id;
        this._title = title;
        this._description = description;
        this._category = category;
        this._stock = stock;
        this._price = price;
        this._image = image;
        this._rating = rating;
    }
    get id() {
        return this._id;
    }
    get title() {
        return this._title;
    }
    set title(title) {
        this._title = title;
    }
    set description(description) {
        this._description = description;
    }
    get description() {
        return this._description;
    }
    get category() {
        return this._category;
    }
    set category(category) {
        this._category = category;
    }
    get stock() {
        return this._stock;
    }
    set stock(stock) {
        this._stock = stock;
    }
    get price() {
        return this._price;
    }
    set price(price) {
        this._price = price;
    }
    get image() {
        return this._image;
    }
    set image(image) {
        this._image = image;
    }
    get rating() {
        return this._rating;
    }
    set rating(rating) {
        this._rating = rating;
    }
    toJSON() {
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
    static setMaxid(id) {
        this.currentMaxId = id;
    }
}
exports.Product = Product;
Product.currentMaxId = 0;
