"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductController = void 0;
const product_1 = require("../model/product");
const productServiceV1_1 = require("../services/productServiceV1");
class ProductController {
    static async getProducts(req, res) {
        const { minPrice, maxPrice, minStock, maxStock } = req.query;
        try {
            const maxP = parseFloat(maxPrice) || undefined;
            const minP = parseFloat(minPrice) || undefined;
            const maxS = parseFloat(maxStock) || undefined;
            const minS = parseFloat(minStock) || undefined;
            const products = await productServiceV1_1.ProductService.listProducts(minP, maxP, minS, maxS);
            if (products.length !== 0) {
                res.status(200).json(products);
            }
            else {
                res.status(404).json({ message: "Nothing There" });
            }
        }
        catch (error) {
            res.status(500).json({ message: "Internal Issue" });
        }
    }
    static async addProduct(req, res) {
        const { title, description, category, stock, price, image, rating } = req.body;
        const productInstance = new product_1.Product(await productServiceV1_1.ProductService.highestIdFromList() + 1, title || "", description || "", category || "", price !== undefined ? price : 0, stock !== undefined ? stock : 0, image || "", rating !== undefined ? rating : { rate: 0, count: 0 });
        try {
            const success = await productServiceV1_1.ProductService.addProduct(productInstance);
            if (success) {
                res.status(201).json({ message: "Product added successfully" });
            }
            else {
                res.status(400).json({ message: "Failed to add product. Please check the product details and try again." });
            }
        }
        catch (error) {
            res.status(500).json({ message: "Internal Issue" });
        }
    }
    static async editProduct(req, res) {
        const { title, description, category, stock, price } = req.body;
        const { id } = req.params;
        try {
            const editProduct = new product_1.Product(parseFloat(id), title || "", description || "", category || "", parseFloat(price) || 0.0, parseInt(stock) || 0, "", // Assuming image is not being updated here
            { rate: 0, count: 0 } // Assuming rating is not being updated here
            );
            await productServiceV1_1.ProductService.editProduct(parseFloat(id), editProduct.toJSON()).then((respon) => {
                if (respon) {
                    res.status(200).json({ message: "Product edited" });
                }
                else {
                    res.status(404).json({ message: "Product not found" });
                }
            });
        }
        catch (error) {
            res.status(500).json({ message: "Internal Issue" });
        }
    }
    static async deleteProduct(req, res) {
        const { id } = req.params;
        try {
            await productServiceV1_1.ProductService.deleteProduct(parseFloat(id)).then((respon) => {
                if (respon) {
                    res.status(200).json({ message: "Product deleted" });
                }
                else {
                    res.status(204).json({ message: "No Product To Delete" });
                }
            });
        }
        catch (error) {
            res.status(500).json({ message: "Internal Issue" });
        }
    }
}
exports.ProductController = ProductController;
