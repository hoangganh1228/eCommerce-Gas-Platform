'use strict';
'use strict'
const { model, Schema } = require('mongoose'); // Erase if already required

const DOCUMENT_NAME = 'Product'
const COLLECTION_NAME = 'Products'

//!dmbg
var productSchema = new Schema({
  product_name:{
    type:String,
    required: true
  },
  product_thmb:{
    type:String,
    required: true
  },
  product_description: {
    type:String,
  },
  product_price: {
    type:Number,
    required: true
  },
  product_quantity: {
    type:Number,
    required: true
  },
  product_type: {
    type:String,
    enum: ['Electronics', 'Clothing', 'Furniture']
  },
  product_shop: {
    type: Schema.Types.ObjectId,
    ref: 'Shop'
  },
  product_attributes: {
    type: Schema.Types.Mixed,
    required: true
  },
}, {
  timestamps: true,
  collection: COLLECTION_NAME
});


// define the product type = clothing
const clothingSchema = new Schema({
  brand: {
    type: String, 
    requrie: true
  },
  size: String,
  material: String
}, {
  collection: 'clothes',
  timestamps: true
})


// define the product type = electronics
const electronicSchema = new Schema({
  manufacturer: {
    type: String, 
    requrie: true
  },
  model: String,
  color: String
}, {
  collection: 'electronics',
  timestamps: true
})

//Export the model
module.exports = {
  product: model(DOCUMENT_NAME, productSchema),
  electronic: model('Electronics', electronicSchema),
  clothing: model('Clothing', clothes)
};