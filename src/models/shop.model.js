'use strict'
const { model, Schema, Types } = require('mongoose'); // Erase if already required

const DOCUMENT_NAME = 'Shop'
const COLLECTION_NAME = 'Shops'

//!dmbg
var shopSchema = new Schema({
  name:{
    type:String,
    trim: true,
    maxLength: 150
  },
  email:{
    type:String,
    unique:true,
    trim: true
  },
  status:{
    type:String,
    enum: ['inactive', 'active'],
    default: 'inactive'
  },
  password:{
    type:String,
    required:true,
  },
  verify: {
    type: Schema.Types.Boolean,
    default: false
  },
  roles: {
    type: Array,
    default: []
  }
}, {
  timestamps: true,
  collection: COLLECTION_NAME
});

//Export the model
module.exports = model(DOCUMENT_NAME, shopSchema);