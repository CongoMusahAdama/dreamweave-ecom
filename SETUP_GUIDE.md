# 🚀 HARV DREAMS E-commerce Platform - Complete Setup Guide

This guide will help you set up the complete HARV DREAMS e-commerce platform with MongoDB backend, authentication, and a modern React frontend.

## 📋 Prerequisites

- **Node.js** (v16 or higher)
- **MongoDB** (local installation or MongoDB Atlas account)
- **Cloudinary** account (for image uploads)
- **Git** (for version control)

## 🛠️ Backend Setup

### 1. Install Backend Dependencies

```bash
cd dreamweave-ecom/backend
npm install
```

### 2. Environment Configuration

Create and configure your `config.env` file in the backend directory:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# MongoDB Configuration
MONGODB_URI=mongodb://localhost:27017/harv-dreams
# For MongoDB Atlas: mongodb+srv://username:password@cluster.mongodb.net/harv-dreams

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRE=7d

# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret

# Admin Default Credentials
ADMIN_EMAIL=admin@harvdreams.com
ADMIN_PASSWORD=admin123

# CORS Configuration
FRONTEND_URL=http://localhost:5173
```

### 3. Start MongoDB

**Local MongoDB:**
```bash
mongod
```

**MongoDB Atlas:**
- Create a free cluster at [MongoDB Atlas](https://www.mongodb.com/atlas)
- Get your connection string and update `MONGODB_URI`

### 4. Start Backend Server

```bash
# Development mode
npm run dev

# Production mode
npm start
```

### 5. Setup Admin User

```bash
curl -X POST http://localhost:5000/api/admin/setup
```

**Default Admin Credentials:**
- Email: `admin@harvdreams.com`
- Password: `admin123`

## 🎨 Frontend Setup

### 1. Install Frontend Dependencies

```bash
cd dreamweave-ecom
npm install
```

### 2. Start Frontend Development Server

```bash
npm run dev
```

The frontend will be available at `http://localhost:5173`

## 🔐 Authentication Flow

### User Registration/Login

1. **Public Access**: Homepage and Gallery are publicly accessible
2. **Protected Routes**: Products page requires authentication
3. **Admin Routes**: All admin pages require admin privileges

### Authentication Features

- **JWT Token Management**: Automatic token storage and validation
- **Role-Based Access**: Customer vs Admin permissions
- **Persistent Sessions**: Login state persists across browser sessions
- **Protected Routes**: Automatic redirect to login when needed

## 📊 Database Schema

### Users Collection
```javascript
{
  name: String,
  email: String (unique),
  password: String (hashed),
  role: 'customer' | 'admin',
  phone: String,
  addresses: Array,
  isActive: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

### Products Collection
```javascript
{
  name: String,
  description: String,
  price: Number,
  category: 'hoodies' | 'tees' | 'jerseys' | 'caps' | 'accessories',
  images: {
    front: String (URL),
    back: String (URL),
    additional: [String]
  },
  stock: Number,
  sizes: Array,
  isActive: Boolean,
  isFeatured: Boolean,
  isNewArrival: Boolean,
  ratings: {
    average: Number,
    count: Number
  },
  reviews: Array,
  createdBy: ObjectId (ref: User)
}
```

### Orders Collection
```javascript
{
  orderNumber: String (unique),
  customer: ObjectId (ref: User),
  items: [{
    product: ObjectId (ref: Product),
    name: String,
    price: Number,
    quantity: Number,
    size: String
  }],
  shippingAddress: Object,
  paymentInfo: Object,
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled',
  totalPrice: Number,
  itemsPrice: Number,
  taxPrice: Number,
  shippingPrice: Number
}
```

## 🖼️ Image Upload System

### Cloudinary Integration

1. **Sign up** for a free Cloudinary account
2. **Get credentials** from your dashboard
3. **Update config.env** with your Cloudinary details

### Image Features

- **Automatic Optimization**: Images are resized and optimized
- **Multiple Formats**: Support for JPG, PNG, WebP
- **Front/Back Views**: Product images with front and back views
- **Automatic Cleanup**: Old images are deleted when updated

## 🔒 Security Features

### Backend Security
- **Input Validation**: All inputs validated with express-validator
- **Rate Limiting**: 100 requests per 15 minutes per IP
- **Security Headers**: Helmet.js for security headers
- **CORS Protection**: Configured for frontend domain only
- **Password Hashing**: bcryptjs for secure password storage
- **JWT Authentication**: Secure token-based authentication

### Frontend Security
- **Protected Routes**: Authentication required for sensitive pages
- **Role-Based Access**: Admin-only routes
- **Token Management**: Secure token storage and validation
- **Input Sanitization**: Form validation and sanitization

## 📱 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user
- `PUT /api/auth/profile` - Update profile
- `POST /api/auth/logout` - User logout

### Products
- `GET /api/products` - Get all products (public)
- `GET /api/products/:id` - Get single product (public)
- `POST /api/products` - Create product (admin only)
- `PUT /api/products/:id` - Update product (admin only)
- `DELETE /api/products/:id` - Delete product (admin only)
- `POST /api/products/:id/reviews` - Add review (authenticated)

### Orders
- `GET /api/orders` - Get orders (user/admin)
- `POST /api/orders` - Create order (authenticated)
- `PUT /api/orders/:id/status` - Update status (admin only)

### Admin
- `GET /api/admin/dashboard` - Dashboard statistics
- `GET /api/admin/analytics` - Analytics data
- `GET /api/admin/health` - System health check

## 🎯 Key Features

### Customer Features
- **Browse Products**: View all products with filtering and search
- **Product Details**: View product information with front/back images
- **Shopping Cart**: Add products to cart with size selection
- **Order Management**: Place orders and track status
- **User Profile**: Manage personal information and addresses
- **Product Reviews**: Rate and review products

### Admin Features
- **Dashboard**: Overview of sales, orders, and customers
- **Product Management**: Add, edit, and delete products
- **Order Management**: Process orders and update status
- **Customer Management**: View customer information and orders
- **Analytics**: Sales reports and business insights
- **Image Upload**: Upload product images with automatic optimization

## 🚀 Deployment

### Backend Deployment

1. **Environment Variables**: Update `config.env` for production
2. **Database**: Use MongoDB Atlas for cloud database
3. **Image Storage**: Configure Cloudinary for production
4. **Security**: Update JWT secret and enable HTTPS

### Frontend Deployment

1. **Build**: `npm run build`
2. **Deploy**: Upload build folder to your hosting service
3. **Environment**: Update API endpoints for production

## 🧪 Testing

### Backend Testing
```bash
# Health check
curl http://localhost:5000/api/health

# Register user
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"John Doe","email":"john@example.com","password":"password123"}'

# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"john@example.com","password":"password123"}'
```

### Frontend Testing
1. **User Registration**: Create a new customer account
2. **Admin Login**: Use default admin credentials
3. **Product Management**: Add products through admin panel
4. **Order Flow**: Complete a test order

## 🔧 Troubleshooting

### Common Issues

1. **MongoDB Connection Error**
   - Check if MongoDB is running
   - Verify connection string in `config.env`
   - Ensure network access for MongoDB Atlas

2. **Image Upload Failures**
   - Verify Cloudinary credentials
   - Check file size limits (5MB max)
   - Ensure proper file formats (JPG, PNG, WebP)

3. **Authentication Issues**
   - Clear browser localStorage
   - Check JWT token expiration
   - Verify backend is running

4. **CORS Errors**
   - Update `FRONTEND_URL` in backend config
   - Ensure frontend and backend ports match

## 📞 Support

For additional support:
- Check the backend README.md for detailed API documentation
- Review the frontend component documentation
- Create an issue in the repository

---

**🎉 Congratulations!** Your HARV DREAMS e-commerce platform is now ready to use!

**Next Steps:**
1. Customize the design and branding
2. Add your product catalog
3. Configure payment processing
4. Set up email notifications
5. Deploy to production

**Happy Selling! 🛍️**
