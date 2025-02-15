'use strict';
const { filter } = require("lodash");
const keytokenModel = require("../models/keytoken.model");
const { Types } = require('mongoose')
const { options } = require("../routes");

class KeyTokenService {
  static createKey = async ({userId, publicKey, privateKey, refreshToken}) => {
    try {
      // level 0
      // const tokens = await keyTokenModel.create({
      //   user: userId,
      //   publicKey,
      //   privateKey
      // })

      // return tokens ? publicKey : null

      // level xxx
      const filter = {user: userId}, update = {
        publicKey, privateKey, refreshTokenUsed: [], refreshToken
      }, options = {upsert: true, new: true}
      const tokens = await keytokenModel.findOneAndUpdate(filter, update, options)

      return tokens ? tokens.publicKey : null
    } catch (error) {
      return error
    }
  }

  static findByUserId = async(userId) => {
    return await keytokenModel.findOne({user: new Types.ObjectId(userId)}).lean()
  }

  static removeKeyById = async (id) => {
    return await keytokenModel.deleteOne(id)
  }

  static findByRefreshTokenUsed = async (refreshToken) => {
    return await keytokenModel.findOne({ refreshTokensUsed: { $in: [refreshToken] } }).lean();
  }

  static findByRefreshToken = async (refreshToken) => {
    return await keytokenModel.findOne({refreshToken})
  }
  static deleteKeyById = async (userId) => {
    return await keytokenModel.deleteOne({user: new Types.ObjectId(userId)})
  }
  
}

module.exports = KeyTokenService