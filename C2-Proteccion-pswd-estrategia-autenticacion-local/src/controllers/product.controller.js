import productModel from '../models/product.model.js';

export const getAllProducts = async (req, res, next) => {
    try {
        let { limit = 10, page = 1, sort, category, stock } = req.query;

        if (limit < 0 || page < 0) {
            return res.status(400).json({ status: 'error', message: 'The limit and the page must be positive numbers' });
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

        if (category && stock !== undefined) {
            return res.status(400).json({ status: 'error', message: 'Please specify either category or stock, not both at the same time.', });
        }

        const products = await productModel
            .find(filter)
            .skip(skip)
            .sort(sortOption)
            .limit(limitInt);

        const totalProducts = await productModel.countDocuments(filter);
        const totalPages = Math.ceil(totalProducts / limitInt);

        const hasPrevPage = pageInt > 1;
        const hasNextPage = pageInt < totalPages;

        const prevLink = hasPrevPage
            ? `/products?limit=${limitInt}&page=${pageInt - 1}&sort=${sort || ''}&category=${category || ''}&stock=${stock || ''}`
            : null;

        const nextLink = hasNextPage
            ? `/products?limit=${limitInt}&page=${pageInt + 1}&sort=${sort || ''}&category=${category || ''}&stock=${stock || ''}`
            : null;

        res.status(200).json({
            status: 'success',
            payload: products,
            totalPages,
            prevPage: hasPrevPage ? pageInt - 1 : null,
            nextPage: hasNextPage ? pageInt + 1 : null,
            page: pageInt,
            hasPrevPage,
            hasNextPage,
            prevLink,
            nextLink,
        });
    } catch (e) {
        next(e);
    }
};

export const getProductById = async (req, res) => {
    try {
        let prodId = req.params.pid

        if (!prodId) {
            return res.status(404).json({ status: "error", message: "The Product Id must be provided" })
        }

        let response = await productModel.findById(prodId)

        if (!response) {
            return res.status(404).json({ status: "error", message: `Product with id: ${prodId} not found` })
        }

        res.status(200).json({ status: 'success', payload: response });
    } catch (e) {
        console.error('An error occurred:', e);
        res.status(500).json({ status: 'error', message: 'Internal server error. Please try again later.' });
    }
}

export const createProduct = async (req, res, next) => {
    try {
        let body = req.body

        if (!body || !body.title || !body.description || !body.code || !body.price || !body.stock || !body.category) {
            return res.status(400).json({ status: "error", message: "All required fields (title, description, code, price, stock, and category) are required." })
        }

        if (typeof (body.title) != 'string' || typeof (body.description) != 'string' || typeof (body.code) != 'string' || typeof (body.category) != 'string') {
            return res.status(400).json({ status: "error", message: "The fields title, description, code and category must be a text." })
        }

        if (typeof (body.price) != 'number' || typeof (body.stock) != 'number') {
            return res.status(400).json({ status: "error", message: "The field price and stock must be a number." })
        }

        if (body.price < 0 || body.stock < 0) {
            return res.status(400).json({ status: "error", message: "Price and stock must be positive numbers." });
        }

        const response = await productModel.create(body)

        res.status(201).json({ status: "success", payload: response, message: `The product has been created with id: ${response._id}` })
    } catch (e) {
        next(e);
    }
}

export const updateProductById = async (req, res, next) => {
    try {
        let prodId = req.params.pid;
        let updatedProduct = req.body;

        if (!prodId) {
            return res.status(400).json({ status: "error", message: "The Product Id must be provided" });
        }

        if (!updatedProduct) {
            return res.status(400).json({ status: "error", message: "At least one field is required to modify a product" });
        }

        if (updatedProduct.title && typeof (updatedProduct.title) !== 'string') return res.status(400).json({ status: "error", message: "The field title must be a text." });
        if (updatedProduct.description && typeof (updatedProduct.description) !== 'string') return res.status(400).json({ status: "error", message: "The field description must be a text." });
        if (updatedProduct.code && typeof (updatedProduct.code) !== 'string') return res.status(400).json({ status: "error", message: "The field code must be a text." });
        if (updatedProduct.category && typeof (updatedProduct.category) !== 'string') return res.status(400).json({ status: "error", message: "The field category must be a text." });
        if (updatedProduct.price && typeof (updatedProduct.price) !== 'number') return res.status(400).json({ status: "error", message: "The field price must be a number." });
        if (updatedProduct.stock && typeof (updatedProduct.stock) !== 'number') return res.status(400).json({ status: "error", message: "The field stock must be a number." });

        if (updatedProduct.price < 0 || updatedProduct.stock < 0) {
            return res.status(400).json({ status: "error", message: "Price and stock must be positive numbers." });
        }

        const response = await productModel.findByIdAndUpdate(prodId, updatedProduct, { new: true });

        if (!response) {
            return res.status(404).json({ status: "error", message: `Product with id ${prodId} not found` });
        }

        res.status(200).json({ status: "success", payload: response, message: `Product with id ${prodId} modified successfully` });

    } catch (e) {
        next(e);
    }
};


export const deleteProductById = async (req, res, next) => {
    try {
        let prodId = req.params.pid

        if (!prodId) {
            return res.status(400).json({ status: "error", message: "The Product Id must be provided" })
        }

        const response = await productModel.findByIdAndDelete(prodId)

        if (!response) {
            return res.status(404).json({ status: "error", message: `Product with id ${prodId} not found` });
        }

        res.status(200).json({ status: 'success', data: {}, message: `Product with id: ${prodId} has been deleted` })
    } catch (e) {
        next(e)
    }
}

export const renderProducts = async (req, res, next) => {
    try {
        let { limit = 10, page = 1, sort, category, stock } = req.query;

        if (limit < 0 || page < 0) {
            return res.status(400).json({ status: 'error', message: 'The limit and the page must be positive numbers' });
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

        if (category && stock !== undefined) {
            return res.status(400).json({ status: 'error', message: 'Please specify either category or stock, not both at the same time.', });
        }

        const products = await productModel
            .find(filter)
            .lean() //Convierte los docs a obj JS. 
            .skip(skip)
            .sort(sortOption)
            .limit(limitInt);

        const totalProducts = await productModel.countDocuments(filter);
        const totalPages = Math.ceil(totalProducts / limitInt);

        const hasPrevPage = pageInt > 1;
        const hasNextPage = pageInt < totalPages;

        const prevLink = hasPrevPage
            ? `/views/products?${limit ? `limit=${limitInt}` : ''}${page ? `&page=${pageInt - 1}` : ''}${sort ? `&sort=${sort}` : ''}${category ? `&category=${category}` : ''}${stock ? `&stock=${stock}` : ''}`
            : null;

        const nextLink = hasNextPage
            ? `/views/products?${limit ? `limit=${limitInt}` : ''}${page ? `&page=${pageInt + 1}` : ''}${sort ? `&sort=${sort}` : ''}${category ? `&category=${category}` : ''}${stock ? `&stock=${stock}` : ''}`
            : null;

        res.status(200).render('templates/index', {
            products,
            hasPrevPage,
            hasNextPage,
            prevLink,
            nextLink,
            currentPage: pageInt,
        });

    } catch (e) {
next(e)
    }
};

export const renderProductDetail = async (req, res, next)=>{
    try {
        let prodId = req.params.pid

        if (!prodId) {
            return res.status(404).json({ status: "error", message: "The Product Id must be provided" })
        }

        let response = await productModel.findById(prodId).lean()

        if (!response) {
            return res.status(404).json({ status: "error", message: `Product with id: ${prodId} not found` })
        }

        res.status(200).render('templates/productDetail',{response});
    } catch (e) {
        next(e)
    }
}