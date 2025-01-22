import {Schema, model} from 'mongoose'
import { text } from 'node:stream/consumers';

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
        type: Number,
        required: true,
    },
    status: {
        type: Boolean,
        default: true,
    },
    stock: {
        type: Number,
        required: true,
        min: 0,
        index: true
    },
    category: {
        type: String,
        required: true,
        index: 'text'
    },
    thumbnails: {
        default: []
    },
});

const productModel = model('products', productSchema)

export default productModel