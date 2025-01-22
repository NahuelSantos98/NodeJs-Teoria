import { Router } from "express";
import {__dirname} from '../path.js'
import { getAllProducts, getProductById, createProduct, updateProductById, deleteProductById } from "../controllers/product.controller.js";

const productRouter = Router();


/**
 * @swagger
*components:
*  schemas:
*    Product:
*      type: object
*      required:
*        - title
*        - description
*        - code
*        - price
*        - stock
*        - category
*      properties:
*        _id:
*          type: string
*          description: The auto-generated MongoDB ObjectId
*          example: "507f1f77bcf86cd799439011"
*        title:
*          type: string
*          description: The product title
*          example: "iPhone 14"
*        description:
*          type: string
*          description: Detailed description of the product
*          example: "Latest generation smartphone with advanced features"
*        code:
*          type: string
*          description: Unique product code identifier
*          example: "IPHONE14-128GB"
*        price:
*          type: number
*          description: Product price
*          example: 999.99
*        status:
*          type: boolean
*          description: Product availability status
*          default: true
*          example: true
*        stock:
*          type: number
*          description: Available quantity in stock
*          minimum: 0
*          example: 50
*        category:
*          type: string
*          description: Product category
*          example: "Electronics"
*        thumbnails:
*          type: array
*          description: Array of product images
*          items:
*            type: string
*          default: []
*          example: ["image1.jpg", "image2.jpg"]
 */

/**
 * @swagger
 * tags:
 *   name: Products
 *   description: API for managing products
 */

/**
* @swagger
* /api/products:
*   get:
*     summary: Get all products with filtering, sorting and pagination
*     tags: [Products]
*     parameters:
*       - in: query
*         name: limit
*         schema:
*           type: integer
*           minimum: 1
*           default: 10
*         description: Number of products to return per page
*       - in: query
*         name: page
*         schema:
*           type: integer
*           minimum: 1
*           default: 1
*         description: Page number
*       - in: query
*         name: sort
*         schema:
*           type: string
*           enum: [asc, desc]
*         description: Sort products by price (asc or desc)
*       - in: query
*         name: category
*         schema:
*           type: string
*         description: Filter products by category
*       - in: query
*         name: stock
*         schema:
*           type: string
*           enum: [true, false]
*         description: Filter products by stock availability (true for stock > 0, false for stock = 0)
*     responses:
*       200:
*         description: Successful response with paginated products
*         content:
*           application/json:
*             schema:
*               type: object
*               properties:
*                 status:
*                   type: string
*                   example: success
*                 payload:
*                   type: array
*                   items:
*                     $ref: '#/components/schemas/Product'
*                 totalPages:
*                   type: integer
*                   example: 5
*                 prevPage:
*                   type: integer
*                   nullable: true
*                   example: 1
*                 nextPage:
*                   type: integer
*                   nullable: true
*                   example: 3
*                 page:
*                   type: integer
*                   example: 2
*                 hasPrevPage:
*                   type: boolean
*                   example: true
*                 hasNextPage:
*                   type: boolean
*                   example: true
*                 prevLink:
*                   type: string
*                   nullable: true
*                   example: "/products?limit=10&page=1"
*                 nextLink:
*                   type: string
*                   nullable: true
*                   example: "/products?limit=10&page=3"
*       400:
*         description: Bad request (invalid parameters)
*         content:
*           application/json:
*             schema:
*               type: object
*               properties:
*                 status:
*                   type: string
*                   example: error
*                 message:
*                   type: string
*                   example: The limit and the page must be positive numbers
*       500:
*         description: Internal server error
*         content:
*           application/json:
*             schema:
*               type: object
*               properties:
*                 status:
*                   type: string
*                   example: error
*                 message:
*                   type: string
*                   example: Internal server error. Please try again later.
*/
productRouter.get('/', getAllProducts);

/**
 * @swagger
 * /api/products/{pid}:
 *   get:
 *     summary: Get a product by ID
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: pid
 *         required: true
 *         schema:
 *           type: string
 *         description: MongoDB ObjectId of the product
 *         example: "507f1f77bcf86cd799439011"
 *     responses:
 *       200:
 *         description: Product found successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 payload:
 *                   $ref: '#/components/schemas/Product'
 *       404:
 *         description: Product not found or ID not provided
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: error
 *                 message:
 *                   type: string
 *                   example: Product with id 507f1f77bcf86cd799439011 not found
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: error
 *                 message:
 *                   type: string
 *                   example: Internal server error. Please try again later.
 */
productRouter.get('/:pid', getProductById)

/**
 * @swagger
 * /api/products:
 *   post:
 *     summary: Create a new product
 *     tags: [Products]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - description
 *               - code
 *               - price
 *               - stock
 *               - category
 *             properties:
 *               title:
 *                 type: string
 *                 example: "iPhone 14"
 *               description:
 *                 type: string
 *                 example: "Latest generation smartphone"
 *               code:
 *                 type: string
 *                 example: "IPHONE14-128GB"
 *               price:
 *                 type: number
 *                 example: 999.99
 *               stock:
 *                 type: number
 *                 example: 50
 *               category:
 *                 type: string
 *                 example: "Electronics"
 *               thumbnails:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["image1.jpg", "image2.jpg"]
 *     responses:
 *       201:
 *         description: Product created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 payload:
 *                   allOf:
 *                     - $ref: '#/components/schemas/Product'
 *                     - example:
 *                         _id: "507f1f77bcf86cd799439011"
 *                         title: "iPhone 14"
 *                         description: "Latest generation smartphone"
 *                         code: "IPHONE14-128GB"
 *                         price: 999.99
 *                         status: true
 *                         stock: 50
 *                         category: "Electronics"
 *                         thumbnails: ["image1.jpg", "image2.jpg"]
 *                 message:
 *                   type: string
 *                   example: "The product has been created with id: 507f1f77bcf86cd799439011"
 *       400:
 *         description: Invalid input data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: error
 *                 message:
 *                   type: string
 *                   example: All required fields (title, description, code, price, stock, and category) are required.
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: error
 *                 message:
 *                   type: string
 *                   example: Internal server error. Please try again later.
 */
productRouter.post('/', createProduct)

/**
 * @swagger
 * /api/products/{pid}:
 *   put:
 *     summary: Update a product by ID
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: pid
 *         required: true
 *         schema:
 *           type: string
 *         description: MongoDB ObjectId of the product
 *         example: "507f1f77bcf86cd799439011"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 example: "iPhone 14 Pro"
 *               description:
 *                 type: string
 *                 example: "Updated smartphone description"
 *               code:
 *                 type: string
 *                 example: "IPHONE14PRO-128GB"
 *               price:
 *                 type: number
 *                 example: 1099.99
 *               stock:
 *                 type: number
 *                 example: 45
 *               category:
 *                 type: string
 *                 example: "Electronics"
 *               thumbnails:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["newimage1.jpg", "newimage2.jpg"]
 *     responses:
 *       200:
 *         description: Product updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 payload:
 *                   $ref: '#/components/schemas/Product'
 *                 message:
 *                   type: string
 *                   example: "Product with id 507f1f77bcf86cd799439011 modified successfully"
 *       400:
 *         description: Invalid input data or ID not provided
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: error
 *                 message:
 *                   type: string
 *                   example: The Product Id must be provided
 *       404:
 *         description: Product not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: error
 *                 message:
 *                   type: string
 *                   example: "Product with id 507f1f77bcf86cd799439011 not found"
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: error
 *                 message:
 *                   type: string
 *                   example: Internal server error. Please try again later.
 */
productRouter.put('/:pid', updateProductById)

/**
 * @swagger
 * /api/products/{pid}:
 *   delete:
 *     summary: Delete a product by ID
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: pid
 *         required: true
 *         schema:
 *           type: string
 *         description: MongoDB ObjectId of the product
 *         example: "507f1f77bcf86cd799439011"
 */
productRouter.delete('/:pid', deleteProductById)


export default productRouter;
