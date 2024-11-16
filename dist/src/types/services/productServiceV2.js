"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductService = void 0;
exports.initLs = initLs;
const mongoService_1 = require("./mongoService");
const products = [];
async function initLs() {
    products.push(...await (0, mongoService_1.getDatas)());
}
class ProductService {
    static async listProducts(minP, maxP, minS, maxS) {
        let listReturn = products;
        if (minS !== undefined && maxS !== undefined && minS > maxS) {
            return [];
        }
        if (minP !== undefined && maxP !== undefined && minP > maxP) {
            return [];
        }
        listReturn = listReturn.filter(product => {
            return (minP === undefined || product.price >= minP) &&
                (maxP === undefined || product.price <= maxP) &&
                (minS === undefined || product.stock >= minS) &&
                (maxS === undefined || product.stock <= maxS);
        });
        console.log(listReturn);
        return listReturn;
    }
    static async addProduct(product) {
        let response = false;
        try {
            const isTitleValid = /^.{3,50}$/.test(product.title);
            const isStockValid = /^0*?[1-9]\d*$/.test(product.stock.toString());
            const isPriceValid = /^(0|[1-9]\d*)(\.\d+)?$/.test(product.price.toString());
            if (isTitleValid && isStockValid && isPriceValid) {
                response = await (0, mongoService_1.addData)(product);
            }
            else {
                console.error("Validation failed for product:", product);
            }
        }
        catch (error) {
            console.error("Error in addProduct:", error);
        }
        return response;
    }
    static async editProduct(id, editProduct) {
        try {
            console.log(products);
            const index = products.findIndex(product => product._id === id);
            console.log(index);
            if (index === -1) {
                return false;
            }
            const product = products[index];
            for (const [key, value] of Object.entries(editProduct)) {
                if (value !== undefined) {
                    product[key] = value;
                }
            }
            products[index] = product;
            return (0, mongoService_1.editData)(id, product);
            ;
        }
        catch (error) {
            console.log(error);
            return false;
        }
    }
    static async deleteProduct(id) {
        let response = false;
        if (id !== undefined) {
            products.filter(product => product.price <= id);
            response = true;
        }
        return response;
    }
}
exports.ProductService = ProductService;
