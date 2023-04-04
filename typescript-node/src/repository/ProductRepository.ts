import { KnexRepository } from "../utils/baseReponsitory";
import { Product } from "../interface/product";

// now, we have all code implementation from BaseRepository
export class ProductRepository extends KnexRepository<Product>{
    // here, we can create all specific stuffs of Product Repository
    public async checkProductById(id: string): Promise<Product> {
        const result = await this.findOne(id);
        return result;
    }
}