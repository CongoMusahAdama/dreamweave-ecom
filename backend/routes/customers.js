const express = require('express');
const User = require('../models/User');
const Order = require('../models/Order');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// @desc    Get all customers (admin only)
// @route   GET /api/customers
// @access  Private (Admin only)
router.get('/', protect, authorize('admin'), async (req, res) => {
  try {
    const { page = 1, limit = 10, search } = req.query;
    
    let query = { role: 'customer' };
    
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { phone: { $regex: search, $options: 'i' } }
      ];
    }

    const customers = await User.find(query)
      .select('-password')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await User.countDocuments(query);

    res.status(200).json({
      success: true,
      data: {
        customers,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(total / limit),
          totalCustomers: total,
          hasNextPage: page * limit < total,
          hasPrevPage: page > 1
        }
      }
    });
  } catch (error) {
    console.error('Get customers error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching customers'
    });
  }
});

// @desc    Get single customer (admin only)
// @route   GET /api/customers/:id
// @access  Private (Admin only)
router.get('/:id', protect, authorize('admin'), async (req, res) => {
  try {
    const customer = await User.findById(req.params.id)
      .select('-password');

    if (!customer) {
      return res.status(404).json({
        success: false,
        message: 'Customer not found'
      });
    }

    if (customer.role !== 'customer') {
      return res.status(404).json({
        success: false,
        message: 'Customer not found'
      });
    }

    // Get customer orders
    const orders = await Order.find({ customer: customer._id })
      .populate('items.product', 'name images')
      .sort({ createdAt: -1 })
      .limit(10);

    // Calculate customer statistics
    const totalOrders = await Order.countDocuments({ customer: customer._id });
    const totalSpent = await Order.aggregate([
      { $match: { customer: customer._id, status: { $in: ['delivered', 'shipped'] } } },
      { $group: { _id: null, total: { $sum: '$totalPrice' } } }
    ]);

    const lastOrder = await Order.findOne({ customer: customer._id })
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: {
        customer: {
          ...customer.toObject(),
          totalOrders,
          totalSpent: totalSpent[0]?.total || 0,
          lastOrder: lastOrder ? {
            id: lastOrder._id,
            orderNumber: lastOrder.orderNumber,
            totalAmount: lastOrder.totalPrice,
            status: lastOrder.status,
            createdAt: lastOrder.createdAt
          } : null
        },
        recentOrders: orders
      }
    });
  } catch (error) {
    console.error('Get customer error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching customer'
    });
  }
});

// @desc    Update customer (admin only)
// @route   PUT /api/customers/:id
// @access  Private (Admin only)
router.put('/:id', protect, authorize('admin'), async (req, res) => {
  try {
    const { name, email, phone, isActive, addresses } = req.body;

    const customer = await User.findById(req.params.id);
    if (!customer) {
      return res.status(404).json({
        success: false,
        message: 'Customer not found'
      });
    }

    if (customer.role !== 'customer') {
      return res.status(404).json({
        success: false,
        message: 'Customer not found'
      });
    }

    // Update fields
    if (name) customer.name = name;
    if (email) customer.email = email;
    if (phone) customer.phone = phone;
    if (isActive !== undefined) customer.isActive = isActive;
    if (addresses) customer.addresses = addresses;

    await customer.save();

    res.status(200).json({
      success: true,
      message: 'Customer updated successfully',
      data: { customer }
    });
  } catch (error) {
    console.error('Update customer error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating customer'
    });
  }
});

// @desc    Get customer statistics (admin only)
// @route   GET /api/customers/stats/overview
// @access  Private (Admin only)
router.get('/stats/overview', protect, authorize('admin'), async (req, res) => {
  try {
    const totalCustomers = await User.countDocuments({ role: 'customer' });
    const activeCustomers = await User.countDocuments({ role: 'customer', isActive: true });
    const newCustomersThisMonth = await User.countDocuments({
      role: 'customer',
      createdAt: { $gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1) }
    });

    // Top customers by spending
    const topCustomers = await Order.aggregate([
      { $match: { status: { $in: ['delivered', 'shipped'] } } },
      {
        $group: {
          _id: '$customer',
          totalSpent: { $sum: '$totalPrice' },
          orderCount: { $sum: 1 }
        }
      },
      { $sort: { totalSpent: -1 } },
      { $limit: 5 },
      {
        $lookup: {
          from: 'users',
          localField: '_id',
          foreignField: '_id',
          as: 'customer'
        }
      },
      { $unwind: '$customer' },
      {
        $project: {
          name: '$customer.name',
          email: '$customer.email',
          totalSpent: 1,
          orderCount: 1
        }
      }
    ]);

    // Customer growth over time
    const customerGrowth = await User.aggregate([
      { $match: { role: 'customer' } },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' }
          },
          count: { $sum: 1 }
        }
      },
      { $sort: { '_id.year': -1, '_id.month': -1 } },
      { $limit: 6 }
    ]);

    res.status(200).json({
      success: true,
      data: {
        totalCustomers,
        activeCustomers,
        newCustomersThisMonth,
        topCustomers,
        customerGrowth
      }
    });
  } catch (error) {
    console.error('Get customer stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching customer statistics'
    });
  }
});

module.exports = router;
