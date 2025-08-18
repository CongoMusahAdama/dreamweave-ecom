# HARV DREAMS Backend API

A complete Node.js/Express backend API for the HARV DREAMS e-commerce platform with MongoDB/Mongoose, authentication, and image upload capabilities.

## 🚀 Features

- **Authentication & Authorization**: JWT-based authentication with role-based access control
- **Product Management**: CRUD operations for products with image upload
- **Order Management**: Complete order lifecycle with status tracking
- **Customer Management**: Customer profiles and analytics
- **Admin Dashboard**: Comprehensive admin panel with statistics
- **Image Upload**: Cloudinary integration for product images
- **Database**: MongoDB with Mongoose ODM
- **Security**: Input validation, rate limiting, and security headers

## 📋 Prerequisites

- Node.js (v16 or higher)
- MongoDB (local or cloud)
- Cloudinary account (for image uploads)

## 🛠️ Installation

1. **Install dependencies**:
   ```bash
   cd backend
   npm install
   ```

2. **Environment Setup**:
   - Copy `config.env` and update with your values:
   ```env
   # Server Configuration
   PORT=5000
   NODE_ENV=development

   # MongoDB Configuration
   MONGODB_URI=mongodb://localhost:27017/harv-dreams

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

3. **Start MongoDB**:
   - Local: `mongod`
   - Or use MongoDB Atlas cloud service

4. **Run the server**:
   ```bash
   # Development
   npm run dev

   # Production
   npm start
   ```

5. **Setup Admin User** (first time only):
   ```bash
   curl -X POST http://localhost:5000/api/admin/setup
   ```

## 📚 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user
- `PUT /api/auth/profile` - Update profile
- `PUT /api/auth/change-password` - Change password
- `POST /api/auth/logout` - Logout

### Products
- `GET /api/products` - Get all products (public)
- `GET /api/products/:id` - Get single product (public)
- `POST /api/products` - Create product (admin only)
- `PUT /api/products/:id` - Update product (admin only)
- `DELETE /api/products/:id` - Delete product (admin only)
- `POST /api/products/:id/reviews` - Add review (authenticated)
- `GET /api/products/featured` - Get featured products
- `GET /api/products/new-arrivals` - Get new arrivals

### Orders
- `GET /api/orders` - Get orders (user/admin)
- `GET /api/orders/:id` - Get single order
- `POST /api/orders` - Create order (authenticated)
- `PUT /api/orders/:id/status` - Update status (admin only)
- `PUT /api/orders/:id/shipping` - Add shipping info (admin only)
- `PUT /api/orders/:id/cancel` - Cancel order
- `GET /api/orders/stats/overview` - Order statistics (admin only)

### Customers
- `GET /api/customers` - Get all customers (admin only)
- `GET /api/customers/:id` - Get customer details (admin only)
- `PUT /api/customers/:id` - Update customer (admin only)
- `GET /api/customers/stats/overview` - Customer statistics (admin only)

### Admin
- `GET /api/admin/dashboard` - Dashboard statistics
- `GET /api/admin/analytics` - Analytics data
- `POST /api/admin/setup` - Setup admin user
- `GET /api/admin/health` - System health check

## 🔐 Authentication

The API uses JWT tokens for authentication. Include the token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

### User Roles
- **customer**: Regular customers who can browse, order, and review products
- **admin**: Administrators with full access to all features

## 📊 Database Models

### User
- Authentication fields (name, email, password)
- Role-based access control
- Address management
- Profile information

### Product
- Product details (name, description, price)
- Category and stock management
- Image handling (front/back views)
- Reviews and ratings
- SKU generation

### Order
- Order items with product references
- Customer and shipping information
- Payment details
- Status tracking
- Automatic calculations (tax, shipping, totals)

## 🖼️ Image Upload

The API supports image upload via Cloudinary:

1. Images are temporarily stored in the `uploads/` directory
2. Uploaded to Cloudinary with transformations
3. Cloudinary URLs are stored in the database
4. Old images are automatically deleted when updated

## 🔒 Security Features

- **Input Validation**: Express-validator for all inputs
- **Rate Limiting**: 100 requests per 15 minutes per IP
- **Security Headers**: Helmet.js for security headers
- **CORS**: Configured for frontend domain
- **Password Hashing**: bcryptjs for secure password storage
- **JWT**: Secure token-based authentication

## 🚀 Deployment

### Environment Variables
Update `config.env` for production:

```env
NODE_ENV=production
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/harv-dreams
JWT_SECRET=your-production-secret-key
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
FRONTEND_URL=https://yourdomain.com
```

### Production Commands
```bash
npm start
```

## 📝 API Response Format

All API responses follow this format:

```json
{
  "success": true,
  "message": "Operation successful",
  "data": {
    // Response data
  }
}
```

Error responses:
```json
{
  "success": false,
  "message": "Error description",
  "errors": [] // Validation errors if any
}
```

## 🧪 Testing

Test the API endpoints using tools like:
- Postman
- Insomnia
- curl commands

Example curl commands:
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

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Contact the development team

---

**HARV DREAMS Backend API** - Built with ❤️ for the HARV DREAMS e-commerce platform
