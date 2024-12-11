import { Schema, model } from 'mongoose';

const cartSchema = new Schema({
    products: {
        type: [
            {
                prodId: {
                    type: Schema.Types.ObjectId, // Que sea de tipo ObjectId
                    required: true,
                    ref: 'products' // Este valor va a ser una referencia a un id de un objeto de la colección 'products'
                    // Se va a usar el 'prodId' para obtener el producto ENTERO.
                },
                quantity: {
                    type: Number,
                    required: true
                }
            }
        ],
        default: []
    }
});

// Middleware para que no tengas que hacer .populate siempre y que se haga automáticamente:
cartSchema.pre(['findOne'], function () {
    this.populate('products.prodId'); // Esto aplicará populate a consultas 'findOne'
});

const cartModel = model('carts', cartSchema);

export default cartModel;
