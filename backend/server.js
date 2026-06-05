const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

// Import routes
const authRoutes = require('./routes/auth');
const productRoutes = require('./routes/products');
const orderRoutes = require('./routes/orders');
const customerRoutes = require('./routes/customers');
const adminRoutes = require('./routes/admin');
const shopOrderRoutes = require('./routes/shopOrders');
const paymentRoutes = require('./routes/payments');
const paystackWebhookHandler = paymentRoutes.paystackWebhookHandler;
const { isPaystackConfigured } = require('./lib/paystack');
const galleryRoutes = require('./routes/gallery');

const app = express();

// Security middleware — allow shop/admin on another origin to load /uploads images
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: 'cross-origin' },
  })
);
const allowedOrigins = [
  process.env.FRONTEND_URL,
  process.env.RENDER_EXTERNAL_URL,
  'http://localhost:5173',
  'http://localhost:8080',
  'http://127.0.0.1:5173',
  'http://127.0.0.1:8080',
].filter(Boolean);

app.use(cors({
  origin(origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
      return;
    }
    if (origin.endsWith('.onrender.com') || origin.endsWith('.netlify.app')) {
      callback(null, true);
      return;
    }
    callback(new Error('Not allowed by CORS'));
  },
  credentials: true,
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use('/api/', limiter);

// Logging middleware
app.use(morgan('combined'));

// Paystack webhook needs raw body for signature verification
app.post(
  '/api/payments/webhook',
  express.raw({ type: 'application/json' }),
  paystackWebhookHandler
);

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Static files (always serve from backend/uploads regardless of process cwd)
app.use(
  '/uploads',
  express.static(path.join(__dirname, 'uploads'), {
    maxAge: '7d',
    setHeaders(res) {
      res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');
      res.setHeader('Access-Control-Allow-Origin', '*');
    },
  })
);

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/customers', customerRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/shop-orders', shopOrderRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/gallery', galleryRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({ 
    status: 'OK', 
    message: 'HARV DREAMS API is running',
    timestamp: new Date().toISOString()
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error',
  });
});

// API 404
app.use('/api/*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
  });
});

// Production: serve Vite build (combined Render deploy)
if (process.env.NODE_ENV === 'production') {
  const distPath = path.join(__dirname, '..', 'dist');
  app.use(express.static(distPath));
  app.get('*', (req, res) => {
    res.sendFile(path.join(distPath, 'index.html'));
  });
} else {
  app.use('*', (req, res) => {
    res.status(404).json({
      success: false,
      message: 'Route not found',
    });
  });
}

// MongoDB connection
async function warnIfCloudinaryMisconfigured() {
  const { CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET } = process.env;
  if (!CLOUDINARY_CLOUD_NAME || !CLOUDINARY_API_KEY || !CLOUDINARY_API_SECRET) {
    console.warn('⚠️  Cloudinary env vars missing — product images will use local /uploads (lost on Render redeploy).');
    return;
  }
  try {
    const cloudinary = require('cloudinary').v2;
    cloudinary.config({
      cloud_name: CLOUDINARY_CLOUD_NAME,
      api_key: CLOUDINARY_API_KEY,
      api_secret: CLOUDINARY_API_SECRET,
    });
    await cloudinary.api.ping();
    console.log('✅ Cloudinary connected');
  } catch (err) {
    const msg = err?.error?.message || err?.message || 'unknown error';
    console.warn(`⚠️  Cloudinary misconfigured (${msg}). Uploads fall back to /uploads — run npm run migrate:images after fixing CLOUDINARY_CLOUD_NAME.`);
  }
}

mongoose.connect(process.env.MONGODB_URI)
  .then(async () => {
    console.log('✅ Connected to MongoDB');
    await warnIfCloudinaryMisconfigured();
    if (isPaystackConfigured()) {
      console.log('✅ Paystack configured (card checkout enabled)');
    } else {
      console.warn('⚠️  Paystack keys missing — add PAYSTACK_PUBLIC_KEY and PAYSTACK_SECRET_KEY to backend/.env');
    }

    // Start server
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
      console.log(`📊 Environment: ${process.env.NODE_ENV}`);
      console.log(`🌐 Frontend URL: ${process.env.FRONTEND_URL}`);
    });
  })
  .catch((err) => {
    console.error('❌ MongoDB connection error:', err);
    process.exit(1);
  });

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully');
  mongoose.connection.close(() => {
    console.log('MongoDB connection closed');
    process.exit(0);
  });
});

module.exports = app;
