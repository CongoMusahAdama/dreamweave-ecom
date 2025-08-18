const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  name: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  quantity: {
    type: Number,
    required: true,
    min: [1, 'Quantity must be at least 1']
  },
  size: {
    type: String,
    required: true
  },
  color: String,
  image: String
});

const orderSchema = new mongoose.Schema({
  orderNumber: {
    type: String,
    unique: true,
    required: true
  },
  customer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  items: [orderItemSchema],
  shippingAddress: {
    street: {
      type: String,
      required: true
    },
    city: {
      type: String,
      required: true
    },
    state: {
      type: String,
      required: true
    },
    zipCode: String,
    country: {
      type: String,
      default: 'Ghana'
    },
    phone: String
  },
  paymentInfo: {
    id: String,
    status: {
      type: String,
      enum: ['pending', 'paid', 'failed', 'refunded'],
      default: 'pending'
    },
    method: {
      type: String,
      enum: ['mobile_money', 'card', 'bank_transfer', 'cash_on_delivery'],
      required: true
    },
    paidAt: Date
  },
  itemsPrice: {
    type: Number,
    required: true,
    default: 0.0
  },
  taxPrice: {
    type: Number,
    required: true,
    default: 0.0
  },
  shippingPrice: {
    type: Number,
    required: true,
    default: 0.0
  },
  totalPrice: {
    type: Number,
    required: true,
    default: 0.0
  },
  status: {
    type: String,
    enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded'],
    default: 'pending'
  },
  deliveredAt: Date,
  shippingInfo: {
    trackingNumber: String,
    carrier: String,
    estimatedDelivery: Date
  },
  notes: String,
  adminNotes: String
}, {
  timestamps: true
});

// Generate order number
orderSchema.pre('save', function(next) {
  if (!this.orderNumber) {
    const timestamp = Date.now().toString().slice(-8);
    const random = Math.random().toString(36).substring(2, 6).toUpperCase();
    this.orderNumber = `HARV-${timestamp}-${random}`;
  }
  next();
});

// Calculate totals before saving
orderSchema.pre('save', function(next) {
  if (this.items && this.items.length > 0) {
    this.itemsPrice = this.items.reduce((total, item) => {
      return total + (item.price * item.quantity);
    }, 0);
    
    // Calculate tax (assuming 12.5% VAT for Ghana)
    this.taxPrice = this.itemsPrice * 0.125;
    
    // Calculate shipping (free shipping for orders over ₵500)
    this.shippingPrice = this.itemsPrice >= 500 ? 0 : 50;
    
    // Calculate total
    this.totalPrice = this.itemsPrice + this.taxPrice + this.shippingPrice;
  }
  next();
});

// Static method to get orders by status
orderSchema.statics.getByStatus = function(status) {
  return this.find({ status }).populate('customer', 'name email').sort({ createdAt: -1 });
};

// Static method to get orders by customer
orderSchema.statics.getByCustomer = function(customerId) {
  return this.find({ customer: customerId }).populate('items.product').sort({ createdAt: -1 });
};

// Static method to get recent orders
orderSchema.statics.getRecent = function(limit = 10) {
  return this.find()
    .populate('customer', 'name email')
    .sort({ createdAt: -1 })
    .limit(limit);
};

// Instance method to update status
orderSchema.methods.updateStatus = function(newStatus) {
  this.status = newStatus;
  if (newStatus === 'delivered') {
    this.deliveredAt = new Date();
  }
  return this.save();
};

// Instance method to add shipping info
orderSchema.methods.addShippingInfo = function(trackingNumber, carrier, estimatedDelivery) {
  this.shippingInfo = {
    trackingNumber,
    carrier,
    estimatedDelivery
  };
  return this.save();
};

module.exports = mongoose.model('Order', orderSchema);
