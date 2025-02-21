import { productDao } from "../dao/product.dao.js";

class ProductService {
    constructor(dao) {
        this.dao = dao;
    }

    async getAllFiltered(obj,res) {
        try {
            let { limit = 10, page = 1, sort, category, stock } = obj;
            
            if (limit < 0 || page < 0) {
                res.status(400).json("The limit and the page must be positive numbers");
            }

            const limitInt = parseInt(limit, 10) || 10;
            const pageInt = parseInt(page, 10) || 1;
            const skip = (pageInt - 1) * limitInt;

            let sortOption = {};
            if (sort === 'asc') sortOption.price = 1;
            if (sort === 'desc') sortOption.price = -1;

            const filter = {};
            if (category && category.trim() !== '') {
                filter.category = category;
            }

            if (stock !== undefined) {
                if (stock === 'true') {
                    filter.stock = { $gt: 0 };
                } else if (stock === 'false') {
                    filter.stock = { $eq: 0 };
                }
            }

            const filters = {
                filter,
                skip,
                sortOption,
                limitInt
            };

            const products = await this.dao.getAllFiltered(filters);
            const totalProducts = await this.dao.countDocuments(filter);
            const totalPages = Math.ceil(totalProducts / limitInt);

            const hasPrevPage = pageInt > 1;
            const hasNextPage = pageInt < totalPages;

            return {
                status: 'success',
                payload: products,
                totalPages,
                prevPage: hasPrevPage ? pageInt - 1 : null,
                nextPage: hasNextPage ? pageInt + 1 : null,
                page: pageInt,
                hasPrevPage,
                hasNextPage
            };
        } catch (error) {
            throw new Error(error.message)
        }
    }

    async getProductById(id) {
        try {
            const response = await this.dao.getById(id);  // Llamar al DAO para obtener el producto
            if (!response) throw new Error("Product not found");  // Verificar si no se encontró el producto
            return response;  // Devolver la respuesta del DAO
        } catch (error) {
            throw new Error(error.message);  // Propagar el error
        }
    }

    async createProduct(body) {
        try {
            const response = await this.dao.createProduct(body);
            if (!response) throw new Error("Product not created");
            return response;
        } catch (error) {
            throw new Error(error.message);
        }
    }

    async updateProductById(id, updatedProduct){
        try {
            const response = await this.dao.updateProductById(id, updatedProduct)
            if (!response) throw new Error("Product not updated");
            return response
        } catch (error) {
            throw new Error(error.message);
        }
    }

    async deleteProductById(id, res){
        try {
            const response = this.dao.deleteProductById(id)
            if (!response) throw new Error("Product not deleted");
            return response
        } catch (error) {
            throw new Error(error.message);
        }
    }
}

export const productService = new ProductService(productDao);
