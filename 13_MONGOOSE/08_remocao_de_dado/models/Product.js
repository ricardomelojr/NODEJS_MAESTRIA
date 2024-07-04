/* Product.js */
import mongoose from 'mongoose';
import { Schema } from 'mongoose';

const Product = mongoose.model(
  'Product',
  new Schema({
    name: { type: String, required: true },
    price: { type: Number, require: true },
    description: { type: String, required: true },
    image: { type: String, required: true },
  })
);

export default Product;
