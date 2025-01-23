'use strict';

const shopModel = require("../models/shop.model");
const KeyTokenService = require("./keyToken.service")
const bcrypt = require('bcrypt')
const crypto = require('crypto')
const {createTokenPair} = require("../auth/authUtils");
const {getInfoData} = require("../utils/index")
const { format } = require("path");
const { BadRequestError, ConflictRequestError, AuthFailureError } = require("../../core/error.response");
const { findByEmail } = require("./shop.service");
const RoleShop = {
  SHOP: 'SHOP',
  WRITER: 'WRITER',
  EDITOR: 'EDITOR',
  ADMIN: 'ADMIN'
}

class AccessService {
  
  static login = async({email, password, refreshToken = null}) => {
    
    // 1 - check email in db
    // 2 - match password
    // 3 - create AT vs RT and save 
    // 4 - generate tokens
    // 5 - get data return login


    // 1.
    const foundshop = await findByEmail({email});
    if(!foundshop) throw new BadRequestError('Shop not registered')
    
    //2. 
    const match = bcrypt.compare(password, foundshop.password);
    if(!match) throw new AuthFailureError('Authentication error')

    //3.
    const privateKey = crypto.randomBytes(64).toString('hex')
    const publicKey = crypto.randomBytes(64).toString('hex')

    // 4.
    const {_id: userId} = foundshop
    const tokens = await createTokenPair({
      userId,
      email
    }, publicKey, privateKey) 

    await KeyTokenService.createKey({
      refreshToken: tokens.refreshToken,
      privateKey, publicKey, userId
    })

    return {
      shop: getInfoData({fields: ['_id', 'name', 'email'], object: foundshop}),
      tokens
    }

    
  }

  static signUp = async ({name, email, password}) => {
    try {
      // step1: check email exist
      const hoderShop = await shopModel.findOne({email}).lean()
      if(hoderShop) {
        throw new BadRequestError('Error: Shop already registered') 
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