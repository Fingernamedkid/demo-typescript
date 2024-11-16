import { Product } from '../model/product'; 
import { ProductI } from '../interface/productInterface';
import { addData, getDatas, editData } from './mongoService';

const products: ProductI[] = [];

export async function initLs() {
    products.push(...await getDatas());

}

export class ProductService {
   
    
    public static async listProducts(minP?: number, maxP?: number, minS?: number, maxS?: number): Promise<ProductI[]> { // Change return type to Product[]
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
            const isTitleValid = /^.{3,50}$/.test(product.title);
            const isStockValid = /^0*?[1-9]\d*$/.test(product.stock.toString());
            const isPriceValid = /^(0|[1-9]\d*)(\.\d+)?$/.test(product.price.toString());
    
            if (isTitleValid && isStockValid && isPriceValid) {
                response = await addData(product);
            } else {
                console.error("Validation failed for product:", product);
            }
        } catch (error) {
            console.error("Error in addProduct:", error);
        }
        return response;
    }
    
    public static async editProduct(id: number, editProduct: Partial<ProductI>): Promise<boolean> {
        try {
            console.log(products);
            const index = products.findIndex(product => product._id === id);
            console.log(index);
            if (index === -1) {
                return false;
            }
            const product: ProductI = products[index];
            for (const [key, value] of Object.entries(editProduct)) {
                if (value !== undefined) {
                    (product as any)[key] = value; 
                }
            } 
            
            products[index] = product;
            return editData(id, product);;
        }catch(error){
            console.log(error)
            return false;
        }
        
    }

    public static async deleteProduct(id: number): Promise<boolean> {
        let response: boolean = false;
        
        if (id!== undefined){
            products.filter(product => product.price <= id);
            response = true;
        }
        
        return response;
    }
}
