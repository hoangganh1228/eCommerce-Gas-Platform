'use strict';
const { filter } = require("lodash");
const keytokenModel = require("../models/keytoken.model");
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
}

module.exports = KeyTokenService