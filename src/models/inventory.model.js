 'use strict';

'use strict'

const {Schema, model} = require('mongoose'); // Erase if already required

const DOCUMENT_NAME = 'Inventory'
const COLLECTION_NAME = 'Inventories'

// Declare the Schema of the Mongo model
var inventorySchema = new Schema({
  inven_productId: {
    type: Schema.Types.ObjectId,
    ref: 'Product'
  },
  iven_location: {
    type: String, 
    default: 'unKnow'
  },
  inven_stock: {
    type: Number,
    required: true
  },
  inven_shopId: {
    type: Schema.Types.ObjectId,
    ref: 'Shop'
  },
  inven_reservations: {
    type: Array,
    default: []
  }
    
}, {
  collection: COLLECTION_NAME,
  timestamps: true
});

//Export the model
module.exports = {
  inventory: model(DOCUMENT_NAME, inventorySchema)
}