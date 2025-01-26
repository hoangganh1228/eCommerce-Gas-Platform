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
  product_thumb:{
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
    required: true
  },
  size: String,
  material: String,
  product_shop: {
    type: Schema.Types.ObjectId,
    ref: 'Shop'
  },
}, {
  collection: 'clothes',
  timestamps: true
})


// define the product type = electronics
const electronicSchema = new Schema({
  manufacturer: {
    type: String, 
    required: true
  },
  model: String,
  color: String,
  product_shop: {
    type: Schema.Types.ObjectId,
    ref: 'Shop'
  },
}, {
  collection: 'electronics',
  timestamps: true
})

// define the product type = furniture
const furnitureSchema = new Schema({
  brand: {
    type: String, 
    required: true
  },
  size: String,
  material: String,
  product_shop: {
    type: Schema.Types.ObjectId,
    ref: 'Shop'
  },
}, {
  collection: 'furnitures',
  timestamps: true
})

//Export the model
module.exports = {
  product: model(DOCUMENT_NAME, productSchema),
  electronic: model('Electronics', electronicSchema),
  clothing: model('Clothing', clothingSchema),
  furniture: model('Furniture', furnitureSchema)
};