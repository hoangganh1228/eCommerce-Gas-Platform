'use strict';
const {product, clothing, electronic, furniture} = require('../models/product.model')
const {BadRequestError} = require('../../core/error.response')
const {
  findAllDraftsForShop, 
  publishProductByShop,
  findAllPublishForShop,
  unPublishProductByShop,
  searchProductByUser,
  findAllProducts,
  findProduct,
  updateProductById
} = require("../models/ropositories/product.repo");
const { removeUndefinedObject, updateNestedObjectParser } = require('../utils');
const { insertInventory } = require('../models/ropositories/inventory.repo');
// define Factory class to create product

class ProductFactory {
  static productRegistry = {}

  static registerProductType(type, classRef) {
    ProductFactory.productRegistry[type] = classRef
  }

  static async createProduct( type, payload ) {
    const productClass = ProductFactory.productRegistry[type]
    if(!productClass) throw new BadRequestError(`Invalid Product Types ${type}`)

    return new productClass(payload).createProduct()

  }

  static async updateProduct( type, productId, payload ) {
    const productClass = ProductFactory.productRegistry[type]
    if(!productClass) throw new BadRequestError(`Invalid Product Types ${type}`)

    return new productClass(payload).updateProduct(productId)

  }

  // PUT

  static async publishProductByShop({product_shop, product_id}) {
    return await publishProductByShop({product_shop, product_id})
  }

  static async unPublishProductByShop({product_shop, product_id}) {
    return await unPublishProductByShop({product_shop, product_id})
  }

  // END PUT
  
  // Query

  static async findAllDraftsForShop({product_shop, limit =  50, skip = 0}) {
    const query = {product_shop, isDraft: true}
    return await findAllDraftsForShop({query, limit, skip})
  }

  static async findAllPublishForShop({product_shop, limit =  50, skip = 0}) {
    const query = {product_shop, isPublished: true}
    return await findAllPublishForShop({query, limit, skip})
  }

  static async searchProducts({keySearch}) {
    return await searchProductByUser({keySearch})
  }

  static async findAllProducts({limit = 50, sort = 'ctime', page = 1, filter = {isPublished: true}}) {
    return await findAllProducts({limit, sort,filter, page, 
    select: ['product_name', 'product_price', 'prodcut_thumb', 'product_shop']
    })
  }

  static async findProduct({product_id}) {
    return await findProduct({product_id, unSelect: ['__v', 'product_variations']})
  }
}



// define base product class
class Product {
  constructor({
    product_name, product_thumb, product_description, product_price,
    product_type, product_shop, product_attributes, product_quantity
  }) {
    this.product_name = product_name
    this.product_thumb = product_thumb
    this.product_description = product_description
    this.product_price = product_price
    this.product_type = product_type
    this.product_shop = product_shop
    this.product_attributes = product_attributes
    this.product_quantity = product_quantity

  }

  // create new product
  async createProduct(product_id) {
    const newProduct = await product.create({
      ...this,
      _id: product_id
    })

    if(newProduct) {
      // add product_stock in inventory collection
      await insertInventory({
        productId: newProduct._id,
        shopId: this.product_shop,
        stock: this.product_quantity
      })
    }

    return newProduct
  }

  // update Product
  async updateProduct(productId, bodyUpdate) {
    return await updateProductById({productId, bodyUpdate, model: product})
  }
}

// define sub-class for different product types clothing
class Clothing extends Product {
  async createProduct() {
    const newClothing = await clothing.create(this.product_attributes)
    if(!newClothing) throw new BadRequestError('create new clothing error')
    
    const newProduct = await super.createProduct()
    if(!newProduct) throw new BadRequestError('create new product error')

    return newProduct
  }

  async updateProduct(productId) {
    // 1. remove attr has null, undefined
    console.log(`[1]::`, this);
    const objectParams = removeUndefinedObject(this)
    console.log(`[2]::`, objectParams);
    
    // 2. check xem update o dau 
    
    if(objectParams.product_attributes) {
      // update child
      await updateProductById({
        productId, 
        bodyUpdate: updateNestedObjectParser(objectParams.product_attributes), 
        model: clothing
      })
    }

    const updateProduct = await super.updateProduct(productId, updateNestedObjectParser(objectParams))
    return updateProduct
  }
}

// define sub-class for different product types electronic
class Electronics extends Product {
  async createProduct() {
    const newElectronic = await electronic.create({
      ...this.product_attributes,
      product_shop: this.product_shop  
    })
    if(!newElectronic) throw new BadRequestError('create new Electronic error')
    
    const newProduct = await super.createProduct(newElectronic._id)
    if(!newProduct) throw new BadRequestError('create new product error')

    return newProduct
  }
}

// define sub-class for different product types electronic
class Furniture extends Product {
  async createProduct() {
    const newFurniture = await furniture.create({
      ...this.product_attributes, 
      product_shop: this.product_shop  
    })
    if(!newFurniture) throw new BadRequestError('create new Furniture error')
    
    const newProduct = await super.createProduct(newFurniture._id)
    if(!newProduct) throw new BadRequestError('create new product error')

    return newProduct
  }
}

// register product type
ProductFactory.registerProductType('Electronics', Electronics)
ProductFactory.registerProductType('Clothing', Clothing)
ProductFactory.registerProductType('Furniture', Furniture)

// ProductFactory.registerProductType('Furniture', Furniture)

module.exports = ProductFactory