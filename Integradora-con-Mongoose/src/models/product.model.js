import {Schema, model} from 'mongoose'

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
        index:true //Está indexado, por lo cual va a ser mas facil la busqeuda por este parametro
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
    },
    category: {
        type: String,
        required: true,
        index:"text" //Está indexado, por lo cual va a ser mas facil la busqeuda por este parametro
    },
    thumbnails: {
        default: []
    },
});

const productModel = model('products', productSchema)

export default productModel