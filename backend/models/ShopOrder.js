const mongoose = require('mongoose');

const shopOrderItemSchema = new mongoose.Schema({
  productId: { type: Number, required: true },
  name: { type: String, required: true },
  size: { type: String, required: true },
  quantity: { type: Number, required: true, min: 1 },
  price: { type: String, required: true },
  priceAmount: { type: Number, required: true },
  colorPreference: { type: String, trim: true },
}, { _id: false });

const shopOrderSchema = new mongoose.Schema({
  orderNumber: {
    type: String,
    unique: true,
    required: true,
  },
  customer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  items: [shopOrderItemSchema],
  shippingAddress: {
    fullName: String,
    phone: String,
    street: String,
    city: String,
    region: String,
    country: { type: String, default: 'Ghana' },
    deliveryMethod: {
      type: String,
      enum: ['delivery', 'pickup'],
      default: 'delivery',
    },
    pickupStation: String,
  },
  totalAmount: { type: Number, required: true },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'],
    default: 'pending',
  },
  channel: {
    type: String,
    enum: ['whatsapp', 'paystack', 'web'],
    default: 'whatsapp',
  },
  paystackReference: {
    type: String,
    trim: true,
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'paid', 'failed'],
    default: 'pending',
  },
  statusHistory: [{
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'],
      required: true,
    },
    changedAt: {
      type: Date,
      default: Date.now,
    },
    changedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    note: {
      type: String,
      trim: true,
    },
  }],
}, {
  timestamps: true,
});

shopOrderSchema.pre('validate', function generateOrderNumber(next) {
  if (!this.orderNumber) {
    const suffix = Date.now().toString(36).toUpperCase();
    this.orderNumber = `HD-${suffix}`;
  }
  next();
});

module.exports = mongoose.model('ShopOrder', shopOrderSchema);
