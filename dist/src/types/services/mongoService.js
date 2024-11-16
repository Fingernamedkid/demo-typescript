"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.highestId = highestId;
exports.getDatas = getDatas;
exports.addData = addData;
exports.editData = editData;
exports.deleteData = deleteData;
const mongodb_1 = require("mongodb");
const product_1 = require("../model/product");
const dotenvconfig_1 = require("../../config/dotenvconfig");
const __1 = require("../..");
// Details from the env
const dbHost = (0, dotenvconfig_1.loadEnvConfig)(__1.setting).dbHost || "";
console.log("DB_HOST: ", dbHost);
const dbName = (0, dotenvconfig_1.loadEnvConfig)(__1.setting).dbName || "";
const dbCollection = (0, dotenvconfig_1.loadEnvConfig)(__1.setting).dbCollection || "";
console.log("DB_NAME: ", dbName);
console.log("DB_COLLECTION: ", dbCollection);
const client = new mongodb_1.MongoClient(dbHost);
async function connect() {
    await client.connect();
    return client.db(dbName).collection(dbCollection);
}
async function highestId() {
    try {
        const gamesCollection = await connect();
        const result = await gamesCollection.find().sort({ _id: -1 }).limit(1).toArray();
        console.log("Highest ID fetched from MongoDB:", result);
        return result.length > 0 ? parseInt(result[0]._id.toString()) : 0;
    }
    catch (error) {
        console.error("Error in highestId:", error);
        return 0;
    }
}
async function getDatas() {
    try {
        const gamesCollection = await connect();
        const products = await gamesCollection.find().toArray();
        return products.map((product) => {
            return new product_1.Product(product._id, product.title, product.description, product.category, product.stock, product.price, product.image, product.rating).toJSON();
        });
    }
    catch (error) {
        console.error("Error in getDatas:", error);
        return [];
    }
}
async function addData(product) {
    try {
        const gamesCollection = await connect();
        const result = await gamesCollection.insertOne(product);
        if (result.acknowledged) {
            console.log("1 document inserted");
            return true;
        }
        else {
            console.error("Error in addData: Insert operation was not acknowledged");
            return false;
        }
    }
    catch (error) {
        console.error("Error in addData:", error);
        return false;
    }
}
async function editData(id, product) {
    try {
        const gamesCollection = await connect();
        console.log(product);
        const existingProduct = await gamesCollection.findOne({ _id: id });
        if (!existingProduct) {
            console.error("Error in editData: Product not found with ID:", id);
            return false;
        }
        const updateData = Object.assign(Object.assign({}, existingProduct), product);
        await gamesCollection.updateOne({ _id: id }, { $set: updateData });
        console.log("Product updated with ID:", id);
        return true;
    }
    catch (error) {
        console.error("Error in editData:", error);
        return false;
    }
}
async function deleteData(id) {
    try {
        const gamesCollection = await connect();
        await gamesCollection.deleteOne({ id: id });
        console.log("Product deleted with ID:", id);
        return true;
    }
    catch (error) {
        console.error("Error in deleteData:", error);
        return false;
    }
}
