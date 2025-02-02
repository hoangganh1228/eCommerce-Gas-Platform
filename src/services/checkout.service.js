'use strict';

const { findCartById } = require("../models/ropositories/cart.repo");

const {
  BadRequestError,
  NotFoundError
} =  require("../../core/error.response");
const { checkProductByServer } = require("../models/ropositories/product.repo");
const { product } = require("../models/product.model");

const {getDiscountAmout} = require("../services/discount.service")

class CheckoutService {
  
  static async checkoutReview({
    cartId, userId, shop_order_ids = []
  }) {
    // check cartId tom tai khong?
    const foundCart = await findCartById(cartId);
    if(!foundCart) throw new BadRequestError('Cart does not exist!')
    
    const checkout_order = {
      totalPrice: 0,
      feeShip: 0,
      totalDiscount: 0,
      totalCheckout: 0   //tong thanh toan
    }, shop_order_ids_new = []

    //tinh tong tien bill
    for(let i = 0; i < shop_order_ids.length; i++) {
      const {shopId, shop_discounts = [], item_products = []} = shop_order_ids[i]
      // chek product available
      const checkProductServer = await checkProductByServer(item_products)
      console.log(`checkProductService::`, checkProductServer);
      if(!checkProductServer[0]) throw new BadRequestError('order wrong!')

      // tong tien don hang 
      const checkoutPrice = checkProductServer.reduce((acc, product) => {
        return acc + (product.quantity * product.price)
      }, 0)

      // tong tien truoc khi xu ly
      checkout_order.totalPrice += checkoutPrice

      const itemCheckout = {
        shopId,
        shop_discounts,
        priceRaw: checkoutPrice, // tien truoc khi giam gia
        priceApplyDiscount: checkoutPrice,
        item_products: checkProductServer
      }

      // neu shop_discounts ton tai > 0, check xem co hop le hay khong?
      if(shop_discounts.length > 0) {
        // gia su chi co mit discount
        // get amount discount

        const {totalPrice = 0, discount = 0} = await getDiscountAmout({
          codeId: shop_discounts[0].codeId,
          userId,
          shopId,
          products: checkProductServer
        })

        // Tong cong discount giam gia
        checkout_order.totalDiscount += discount

        // neu tien giam gia lon hon 0
        if(discount > 0) {
          itemCheckout.priceApplyDiscount = checkoutPrice - discount
        }
      }

      // tong thanh toan cuoi cung
      checkout_order.totalCheckout += itemCheckout.priceApplyDiscount

      shop_order_ids_new.push(itemCheckout)
    }

    return {
      shop_order_ids,
      shop_order_ids_new,
      checkout_order
    }
  }
}

module.exports = CheckoutService