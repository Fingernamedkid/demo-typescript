import { rating } from "./rating";
export interface ProductI {
    _id: number;
    title: string;
    description:string;
    category:string;
    stock:number;
    price: number;
    image: string;
    rating: rating;

}

