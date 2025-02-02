'use strict';

class CheckoutService {
  
  static async checkoutReview({
    cartId, userId, shop_order_ids
  }) {
    // check cartId tom tai khong?
    const foundCart = await findCartById(cartId)
  }
}

module.exports = CheckoutService