import {Schema, model} from 'mongoose'

const cartSchema = new Schema({
    products: {
        type: [
            {
                prodId: {
                    type: Schema.Types.ObjectId, //Que sea de tipo ObjectId
                    required: true,
                    ref: 'products' 
                    //Este valor va a ser una referencia a un id de un objeto de la coleccion products
                },
                quantity: {
                    type: Number,
                    required: true
                }
            }
        ],
        default: []
    }
})

const cartModel = model('carts', cartSchema)

export default cartModel;