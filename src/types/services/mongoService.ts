import { MongoClient, ObjectId } from 'mongodb';
import { ProductI } from '../interface/productInterface';
import { Product } from '../model/product';
import { loadEnvConfig } from '../../config/dotenvconfig';


// Details from the env
const dbHost: string = loadEnvConfig().dbHost || "";
console.log("DB_HOST: ", dbHost);
const dbName: string = loadEnvConfig().dbName || "";
const dbCollection: string = loadEnvConfig().dbCollection || "";
console.log("DB_NAME: ", dbName);
console.log("DB_COLLECTION: ", dbCollection);

const client: MongoClient = new MongoClient(dbHost);

async function connect() {
        await client.connect();
    
    return client.db(dbName).collection<ProductI>(dbCollection);
}

export async function highestId(): Promise<number> {
    try {
        const gamesCollection = await connect();
        const result = await gamesCollection.find().sort({ _id: -1 }).limit(1).toArray();
        console.log("Highest ID fetched from MongoDB:", result);
        return result.length > 0 ? parseInt(result[0]._id.toString()) : 0;
    } catch (error) {
        console.error("Error in highestId:", error);
        return 0;
    }
}

export async function getDatas(): Promise<ProductI[]> {
    try {
        const gamesCollection = await connect();
        const products = await gamesCollection.find().toArray();
        return products.map((product) => {
            return new Product(product._id, product.title, product.description, product.category, product.stock, product.price, product.image, product.rating).toJSON();
        });
    } catch (error) {
        console.error("Error in getDatas:", error);
        return [];
    }
}

export async function addData(product: ProductI): Promise<boolean> {
    try {
        const gamesCollection = await connect();
        
        const result = await gamesCollection.insertOne(product);
        if (result.acknowledged) {
            console.log("1 document inserted");
            return true;
        } else {
            console.error("Error in addData: Insert operation was not acknowledged");
            return false;
        }
    } catch (error) {
        console.error("Error in addData:", error);
        return false;
    }
}

export async function editData(id: number, product: Partial<ProductI>): Promise<boolean> {
    try {
        const gamesCollection = await connect();
        console.log(product);
        const existingProduct = await gamesCollection.findOne({ _id: id });
        if (!existingProduct) {
            console.error("Error in editData: Product not found with ID:", id);
            return false;
        }
        const updateData = { ...existingProduct, ...product };
        await gamesCollection.updateOne({ _id: id }, { $set: updateData });
        console.log("Product updated with ID:", id);
        return true;
    } catch (error) {
        console.error("Error in editData:", error);
        return false;
    }
}

export async function deleteData(id: number): Promise<boolean> {
    try {
        const gamesCollection = await connect();
        await gamesCollection.deleteOne({ id: id });
        console.log("Product deleted with ID:", id);
        return true;
    } catch (error) {
        console.error("Error in deleteData:", error);
        return false;
    }
}