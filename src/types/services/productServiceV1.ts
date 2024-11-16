import { Product } from '../model/product'; 
import { ProductI } from '../interface/productInterface';
import fs from "fs";

const products: ProductI[] = [];
try {
  const data = fs.readFileSync("./mockdata.json", 'utf-8');
  products.push(... JSON.parse(data));
  Product.setMaxid(products[products.length - 1]._id);
  console.log("Data loaded")
} catch (error) {
  console.error(error);

  throw error;
}

export default function generatedata(){
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

        fs.writeFile("./mockdata.json", JSON.stringify(data), (error) => {
        if (error) {
            console.error(error);
            throw error;
        }
        });
    })
    .catch((error) => {
        console.error(error);

    });}


export class ProductService {
    
    
    public static async listProducts(minP?: number, maxP?: number, minS?: number, maxS?: number): Promise<ProductI[]> { // Change return type to ProductI[]
        let listReturn: ProductI[] = products; 
    
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
    
    public static async addProduct(product: ProductI): Promise<boolean> {
        let response: boolean = false;
        try {
            if (/^.{3,50}$/.test(product.title) && /^0*?[1-9]\d*$/.test(product.stock.toString()) && /^(0|[1-9]\d*)(\.\d+)?$/.test(product.price.toString())   )
                {        
                    products.push(product);
                    response = true
                }
                
            } 
            catch (error) {
                
            }
            return response;
        }
    
    public static async editProduct(id: number, editProduct: Partial<Product>): Promise<boolean> {
        try {
            const index = products.findIndex(product => product._id === id);
            if (index === -1) {
                return false;
            }
            const product: ProductI = products[index];
            for (const [key, value] of Object.entries(editProduct)) {
                if (value !== undefined) {
                    (product as any)[key] = value; 
                }
            } 
            //https://stackoverflow.com/questions/684672/how-do-i-loop-through-or-enumerate-a-javascript-object
            //loops through each key of an object editproduct. Then if value !== undefined, product.key = value
            products[index] = product;
            return true;
        }catch{
            return false;
        }
        
    }

    public static async deleteProduct(id: number): Promise<boolean> {
        const index = products.findIndex(product => product._id === id);
        if (index === -1) {
            return false;
        }
        products.splice(index, 1);
        return true;
    }
    public static async highestIdFromList(): Promise<number> {
        const result = products.sort((a, b) => b._id - a._id);
        //https://stackoverflow.com/questions/55293071/how-to-sort-an-object-based-on-string
        //sorts the products array in descending order of id
        return result.length > 0 ? result[0]._id : 0;
    }
}
