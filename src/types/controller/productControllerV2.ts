import { Request, Response } from 'express';
import { Product } from '../model/product';
import { ProductService } from '../services/productServiceV2';
import { highestId } from '../services/mongoService';

export class ProductController {
    static async getProducts(req: Request, res: Response) {
        const { minPrice, maxPrice, minStock, maxStock } = req.query;
        try {
          const maxP = parseFloat(maxPrice as string) || undefined;
          const minP = parseFloat(minPrice as string) || undefined;
          const maxS = parseFloat(maxStock as string) || undefined;
          const minS = parseFloat(minStock as string) || undefined;
          
          const products = await ProductService.listProducts(minP, maxP, minS, maxS);
          if (products.length !== 0) {
            res.status(200).json(products);
          } else {
            res.status(404).json({ message: "Nothing There" });
          }
        } catch (error) {
          res.status(500).json({ message: "Internal Issue" });
        }
      }

    static async addProduct(req: Request, res: Response) {
        const { title, description, category, stock, price,image,rating } = req.body;
        const productInstance = new Product(
            await highestId() + 1,
            title || "",
            description || "",
            category || "",
            price !== undefined ? stock : 0,
            stock !== undefined ? price : 0,
            image || "",
            rating !== undefined ? rating : { rate: 0, count: 0 }
          );
        try {
          const success = await ProductService.addProduct(productInstance.toJSON());
          if (success) {
              res.status(201).json({ message: "Product added successfully" });
          } else {
              res.status(400).json({ message: "Failed to add product. Please check the product details and try again." });
          }        
        } catch (error) {
        res.status(500).json({ message: "Internal Issue" });
        }
    }
    
    static async editProduct(req: Request, res: Response) {
        const { title, description, category, stock, price,image,rating } = req.body;
        const { id } = req.params;
    
        try {
        const editProduct = new Product(
            parseFloat(id),
            title || "",
            description || "",
            category || "",
            parseFloat(price) || 0.0,
            parseInt(stock) || 0,
            image|| "", 
            rating || { rate: 0, count: 0 }
        );
    
        await ProductService.editProduct(
            parseFloat(id),
            editProduct.toJSON()
        ).then((respon) => {
            if (respon) {
            res.status(200).json({ message: "Product edited" });
            } else {
            res.status(404).json({ message: "Product not found" });
            }
        });
        } catch (error) {
        res.status(500).json({ message: "Internal Issue" });
        }
    }
    
    static async deleteProduct(req: Request, res: Response) {
        const { id } = req.params;
    
        try {
            const respon = await ProductService.deleteProduct(parseFloat(id));
            if (respon) {
                res.status(200).json({ message: "Product deleted" });
            } else {
                res.status(404).json({ message: "Product not found" });
            }
        } catch (error) {
            res.status(500).json({ message: "Internal Issue" });
        }
    }
    }