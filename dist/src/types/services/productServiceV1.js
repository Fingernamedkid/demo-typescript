"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductService = void 0;
exports.default = generatedata;
const product_1 = require("../model/product");
const fs_1 = __importDefault(require("fs"));
const products = [];
try {
    const data = fs_1.default.readFileSync("./mockdata.json", 'utf-8');
    products.push(...JSON.parse(data));
    product_1.Product.setMaxid(products[products.length - 1]._id);
    console.log("Data loaded");
}
catch (error) {
    console.error(error);
    throw error;
}
function generatedata() {
    fetch("https://fakestoreapi.com/products")
        .then((response) => {
        if (!response.ok) {
            throw new Error("La requête a échoué avec le statut " + response.status);
        }
        return response.json();
    })
        .then((data) => {
        for (const product of data) {
            product.stock = Math.floor(Math.random() * 20);
        }
        fs_1.default.writeFile("./mockdata.json", JSON.stringify(data), (error) => {
            if (error) {
                console.error(error);
                throw error;
            }
        });
    })
        .catch((error) => {
        console.error(error);
    });
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
            if (/^.{3,50}$/.test(product.title) && /^0*?[1-9]\d*$/.test(product.stock.toString()) && /^(0|[1-9]\d*)(\.\d+)?$/.test(product.price.toString())) {
                products.push(product);
                response = true;
            }
        }
        catch (error) {
        }
        return response;
    }
    static async editProduct(id, editProduct) {
        try {
            const index = products.findIndex(product => product._id === id);
            if (index === -1) {
                return false;
            }
            const product = products[index];
            for (const [key, value] of Object.entries(editProduct)) {
                if (value !== undefined) {
                    product[key] = value;
                }
            }
            //https://stackoverflow.com/questions/684672/how-do-i-loop-through-or-enumerate-a-javascript-object
            //loops through each key of an object editproduct. Then if value !== undefined, product.key = value
            products[index] = product;
            return true;
        }
        catch (_a) {
            return false;
        }
    }
    static async deleteProduct(id) {
        const index = products.findIndex(product => product._id === id);
        if (index === -1) {
            return false;
        }
        products.splice(index, 1);
        return true;
    }
    static async highestIdFromList() {
        const result = products.sort((a, b) => b._id - a._id);
        //https://stackoverflow.com/questions/55293071/how-to-sort-an-object-based-on-string
        //sorts the products array in descending order of id
        return result.length > 0 ? result[0]._id : 0;
    }
}
exports.ProductService = ProductService;
