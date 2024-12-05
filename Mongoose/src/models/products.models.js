import mongoose, { Schema } from "mongoose";


const productCollection = 'products'

const productSchema = new Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    code: {
        type: String,
        required: true,
        unique: true, 
    },
    price: {
        type: mongoose.Decimal128,
        required: true,
    },
    status: {
        type: Boolean,
        required: true,
        default: true, 
    },
    stock: {
        type: Number,
        required: true,
        min: 0,
    },
    category: {
        type: String,
        required: true,
    },
    thumbnails: {
        type: [String],
        required: false,
    },
});

export const productModel = mongoose.model(productCollection, productSchema);

