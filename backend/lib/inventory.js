const Product = require('../models/Product');
const { catalogIdFromMongoId } = require('./catalogId');

async function findProductForOrderItem(item) {
  if (item.mongoProductId) {
    const product = await Product.findById(item.mongoProductId);
    if (product) return product;
  }

  if (!item.productId) return null;

  const products = await Product.find({ isActive: true }).select('_id stock soldOut sizes');
  for (const product of products) {
    if (catalogIdFromMongoId(product._id) === Number(item.productId)) {
      return product;
    }
  }

  return null;
}

/**
 * Reduce product stock when a Paystack order is confirmed paid.
 * Sets soldOut when stock reaches zero.
 */
async function decrementStockForPaidOrder(order) {
  if (!order?.items?.length) return;

  for (const item of order.items) {
    const product = await findProductForOrderItem(item);
    if (!product) {
      console.warn(`[inventory] Product not found for order item: ${item.name}`);
      continue;
    }

    const quantity = Math.max(1, Number(item.quantity) || 1);
    product.stock = Math.max(0, product.stock - quantity);

    if (product.sizes?.length) {
      const sizeIndex = product.sizes.findIndex((s) => s.name === item.size);
      if (sizeIndex !== -1) {
        product.sizes[sizeIndex].stock = Math.max(0, product.sizes[sizeIndex].stock - quantity);
      }
    }

    if (product.stock <= 0) {
      product.stock = 0;
      product.soldOut = true;
      if (product.sizes?.length) {
        product.sizes.forEach((size) => {
          size.stock = 0;
        });
      }
    }

    await product.save();
    console.log(
      `[inventory] ${product.name} stock updated — remaining: ${product.stock}${product.soldOut ? ' (sold out)' : ''}`
    );
  }
}

module.exports = { decrementStockForPaidOrder, findProductForOrderItem };
