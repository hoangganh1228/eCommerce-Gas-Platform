'use strict';

const shopModel = require("../models/shop.model");
const KeyTokenService = require("./keyToken.service")
const bcrypt = require('bcrypt')
const crypto = require('crypto')
const {createTokenPair} = require("../auth/authUtils");
const {getInfoData} = require("../utils/index")
const { format } = require("path");
const RoleShop = {
  SHOP: 'SHOP',
  WRITER: 'WRITER',
  EDITOR: 'EDITOR',
  ADMIN: 'ADMIN'
}

class AccessService {

  static signUp = async ({name, email, password}) => {
    try {
      // step1: check email exist
      const hoderShop = await shopModel.findOne({email}).lean()
      if(hoderShop) {
        return {
          code: 'xxxx',
          message: 'Shop already registered'
        }
      }

      // Step 2: Hash password
      const passwordHash = await bcrypt.hash(password, 10)
      
      // Step 3: Create new shop
      const newShop = await shopModel.create({
        name, email, password: passwordHash, roles: [RoleShop.SHOP]
      })

      if(newShop) {
        // // Created privateKey, publicKey

        const privateKey = crypto.randomBytes(64).toString('hex')
        const publicKey = crypto.randomBytes(64).toString('hex')

        console.log({privateKey, publicKey});
        const keyStore = await KeyTokenService.createKey({
          userId: newShop._id,
          publicKey,
          privateKey
        })

        if(!keyStore) {
          return {
            code: 'xxxx',
            message: 'keyStore error'
          }
        }
        
        // created token pair
        const tokens = await createTokenPair({
          userId: newShop._id,
          email
        }, publicKey, privateKey)
        // const tokens = await 
        console.log(`Created Token Success::`, tokens);
        return {
          code: 201,
          metadata: {
            shop: getInfoData({fields: ['_id', 'name', 'email'], object: newShop}),
            tokens
          }
        }
      }

      return {
        code: 200,
        metadata: null
      }
      
    } catch (error) {
      return {
        code: 'xxx',
        message: error.message,
        status: 'error'
      }
    }
  }

}

module.exports = AccessService