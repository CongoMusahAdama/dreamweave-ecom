const express = require('express');
const User = require('../models/User');
const Product = require('../models/Product');
const Order = require('../models/Order');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// All routes require admin access
router.use(protect, authorize('admin'));

// @desc    Get dashboard statistics
// @route   GET /api/admin/dashboard
// @access  Private (Admin only)
router.get('/dashboard', async (req, res) => {
  try {
    // Get basic counts
    const totalProducts = await Product.countDocuments();
    const totalOrders = await Order.countDocuments();
    const totalCustomers = await User.countDocuments({ role: 'customer' });

    // Calculate total sales
    const totalSales = await Order.aggregate([
      { $match: { status: { $in: ['delivered', 'shipped'] } } },
      { $group: { _id: null, total: { $sum: '$totalPrice' } } }
    ]);

    // Get recent orders
    const recentOrders = await Order.find()
      .populate('customer', 'name email')
      .sort({ createdAt: -1 })
      .limit(5);

    // Get low stock products
    const lowStockProducts = await Product.find({ stock: { $lte: 5 } })
      .select('name stock category')
      .limit(10);

    // Get monthly revenue for the last 6 months
    const monthlyRevenue = await Order.aggregate([
      { $match: { status: { $in: ['delivered', 'shipped'] } } },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' }
          },
          revenue: { $sum: '$totalPrice' },
          orders: { $sum: 1 }
        }
      },
      { $sort: { '_id.year': -1, '_id.month': -1 } },
      { $limit: 6 }
    ]);

    // Get top selling products
    const topProducts = await Order.aggregate([
      { $unwind: '$items' },
      {
        $group: {
          _id: '$items.product',
          totalSold: { $sum: '$items.quantity' },
          revenue: { $sum: { $multiply: ['$items.price', '$items.quantity'] } }
        }
      },
      { $sort: { totalSold: -1 } },
      { $limit: 5 },
      {
        $lookup: {
          from: 'products',
          localField: '_id',
          foreignField: '_id',
          as: 'product'
        }
      },
      { $unwind: '$product' },
      {
        $project: {
          name: '$product.name',
          totalSold: 1,
          revenue: 1
        }
      }
    ]);

    res.status(200).json({
      success: true,
      data: {
        stats: {
          totalSales: totalSales[0]?.total || 0,
          totalOrders,
          totalCustomers,
          totalProducts,
          recentSales: monthlyRevenue[0]?.revenue || 0,
          lowStockProducts: lowStockProducts.length
        },
        recentOrders,
        lowStockProducts,
        monthlyRevenue,
        topProducts
      }
    });
  } catch (error) {
    console.error('Get dashboard stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching dashboard statistics'
    });
  }
});

// @desc    Get analytics data
// @route   GET /api/admin/analytics
// @access  Private (Admin only)
router.get('/analytics', async (req, res) => {
  try {
    const { period = '30' } = req.query;
    const days = parseInt(period);

    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    // Sales growth
    const currentPeriodSales = await Order.aggregate([
      { $match: { createdAt: { $gte: startDate }, status: { $in: ['delivered', 'shipped'] } } },
      { $group: { _id: null, total: { $sum: '$totalPrice' } } }
    ]);

    const previousStartDate = new Date(startDate);
    previousStartDate.setDate(previousStartDate.getDate() - days);
    const previousPeriodSales = await Order.aggregate([
      { $match: { createdAt: { $gte: previousStartDate, $lt: startDate }, status: { $in: ['delivered', 'shipped'] } } },
      { $group: { _id: null, total: { $sum: '$totalPrice' } } }
    ]);

    const currentSales = currentPeriodSales[0]?.total || 0;
    const previousSales = previousPeriodSales[0]?.total || 0;
    const salesGrowth = previousSales > 0 ? ((currentSales - previousSales) / previousSales) * 100 : 0;

    // Order growth
    const currentPeriodOrders = await Order.countDocuments({ createdAt: { $gte: startDate } });
    const previousPeriodOrders = await Order.countDocuments({ 
      createdAt: { $gte: previousStartDate, $lt: startDate } 
    });
    const orderGrowth = previousPeriodOrders > 0 ? ((currentPeriodOrders - previousPeriodOrders) / previousPeriodOrders) * 100 : 0;

    // Customer growth
    const currentPeriodCustomers = await User.countDocuments({ 
      role: 'customer', 
      createdAt: { $gte: startDate } 
    });
    const previousPeriodCustomers = await User.countDocuments({ 
      role: 'customer', 
      createdAt: { $gte: previousStartDate, $lt: startDate } 
    });
    const customerGrowth = previousPeriodCustomers > 0 ? ((currentPeriodCustomers - previousPeriodCustomers) / previousPeriodCustomers) * 100 : 0;

    // Product views (simulated - in real app, you'd track this)
    const productViews = 0;
    const productViewsGrowth = 0;

    // Daily sales for chart
    const dailySales = await Order.aggregate([
      { $match: { createdAt: { $gte: startDate }, status: { $in: ['delivered', 'shipped'] } } },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
          revenue: { $sum: '$totalPrice' },
          orders: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    // Category performance
    const categoryPerformance = await Order.aggregate([
      { $unwind: '$items' },
      {
        $lookup: {
          from: 'products',
          localField: 'items.product',
          foreignField: '_id',
          as: 'product'
        }
      },
      { $unwind: '$product' },
      {
        $group: {
          _id: '$product.category',
          revenue: { $sum: { $multiply: ['$items.price', '$items.quantity'] } },
          orders: { $sum: 1 }
        }
      },
      { $sort: { revenue: -1 } }
    ]);

    res.status(200).json({
      success: true,
      data: {
        growth: {
          salesGrowth: Math.round(salesGrowth * 100) / 100,
          orderGrowth: Math.round(orderGrowth * 100) / 100,
          customerGrowth: Math.round(customerGrowth * 100) / 100,
          productViewsGrowth: Math.round(productViewsGrowth * 100) / 100
        },
        dailySales,
        categoryPerformance
      }
    });
  } catch (error) {
    console.error('Get analytics error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching analytics data'
    });
  }
});

// @desc    Create default admin user
// @route   POST /api/admin/setup
// @access  Public (for initial setup)
router.post('/setup', async (req, res) => {
  try {
    // Check if admin already exists
    const existingAdmin = await User.findOne({ role: 'admin' });
    if (existingAdmin) {
      return res.status(400).json({
        success: false,
        message: 'Admin user already exists'
      });
    }

    // Create default admin
    const admin = await User.create({
      name: 'Admin',
      email: process.env.ADMIN_EMAIL || 'admin@harvdreams.com',
      password: process.env.ADMIN_PASSWORD || 'admin123',
      role: 'admin',
      isActive: true
    });

    res.status(201).json({
      success: true,
      message: 'Default admin user created successfully',
      data: {
        user: {
          id: admin._id,
          name: admin.name,
          email: admin.email,
          role: admin.role
        }
      }
    });
  } catch (error) {
    console.error('Setup admin error:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating admin user'
    });
  }
});

// @desc    Get system health
// @route   GET /api/admin/health
// @access  Private (Admin only)
router.get('/health', async (req, res) => {
  try {
    const dbStatus = 'connected'; // You can add more sophisticated DB health checks
    
    const stats = {
      uptime: process.uptime(),
      memory: process.memoryUsage(),
      nodeVersion: process.version,
      platform: process.platform,
      database: dbStatus
    };

    res.status(200).json({
      success: true,
      data: stats
    });
  } catch (error) {
    console.error('Health check error:', error);
    res.status(500).json({
      success: false,
      message: 'Error checking system health'
    });
  }
});

module.exports = router;
