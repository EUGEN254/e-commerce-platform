# E-Commerce Platform

A full-stack e-commerce application with a modern tech stack, featuring a React-based customer client, an admin dashboard for business management, and a robust Node.js/Express backend with MongoDB database.

## 📋 Project Overview

This is a complete e-commerce platform consisting of three main parts:

- **Client** - Customer-facing React application with product browsing, cart, and checkout functionality
- **Admin** - Admin dashboard for managing products, categories, orders, users, and viewing analytics
- **Backend** - Express.js REST API with MongoDB database, handling all business logic and integrations

## 🏗️ Architecture

```
e-commerce-platform/
├── client/          # Customer web application (React + Vite)
├── admin/           # Admin dashboard (React + Vite)
└── backend/         # Node.js/Express API server
```

## 🛠️ Technology Stack

### Frontend (Client & Admin)
- **Framework**: React 19
- **Build Tool**: Vite
- **Styling**: Tailwind CSS 4
- **UI Components**: Radix UI, Lucide Icons
- **Routing**: React Router DOM v7
- **HTTP Client**: Axios
- **Animations**: Framer Motion
- **Notifications**: Sonner, React Toastify
- **State Management**: React Context API

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js 5
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT (JSON Web Tokens)
- **Password Hashing**: bcrypt
- **File Upload**: Multer + Cloudinary
- **Email Service**: Integrated email templates
- **Testing**: Jest
- **Development**: Nodemon
- **Utilities**: Axios, Cookie Parser, CORS, Validator

### DevOps & Deployment
- **Hosting**: Vercel (configured for all three apps)
- **Version Control**: Git
- **Code Quality**: ESLint

## 🚀 Features

### Customer Features (Client)
- Product browsing and search
- Product details and reviews
- Shopping cart functionality
- User authentication (login/signup)
- Order management
- Wishlist support
- Dark mode support
- Responsive design

### Admin Features (Admin Dashboard)
- **Dashboard Analytics**: View sales metrics and statistics
- **Product Management**: Create, update, delete products with image uploads
- **Category Management**: Manage product categories
- **Limited Offers**: Create and manage special promotions
- **Order Management**: Track and manage customer orders
- **User Management**: View and manage user accounts
- **Transaction History**: View all transaction records
- **Settings**: Configure platform settings
- **Charts & Analytics**: Visual data representation with Recharts

### Backend Features
- User authentication and authorization
- Product management with Cloudinary image storage
- Shopping cart and order processing
- Category and inventory management
- Limited time offers/promotions
- M-Pesa payment integration
- User reviews and ratings
- Admin role-based access control
- Rate limiting and security middleware
- Comprehensive error handling and logging
- Input validation

## 📦 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn
- MongoDB database
- Cloudinary account (for image uploads)
- M-Pesa account (optional, for payment processing)

### Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd e-commerce-platform
```

2. **Backend Setup**
```bash
cd backend
npm install
```

Create a `.env` file in the backend directory:
```env
PORT=5000
MONGODB_URI=<your_mongodb_connection_string>
JWT_SECRET=<your_jwt_secret>
CLOUDINARY_NAME=<your_cloudinary_name>
CLOUDINARY_API_KEY=<your_cloudinary_api_key>
CLOUDINARY_API_SECRET=<your_cloudinary_api_secret>
NODE_ENV=development
DEV_ORIGINS=http://localhost:3000,http://localhost:3001
PROD_ORIGINS=<your_production_urls>
```

Start the backend:
```bash
npm run dev
```

3. **Admin Dashboard Setup**
```bash
cd admin
npm install
```

Create a `.env` file:
```env
VITE_API_URL=http://localhost:5000
```

Start the admin:
```bash
npm run dev
```

4. **Client Setup**
```bash
cd client
npm install
```

Create a `.env` file:
```env
VITE_API_URL=http://localhost:5000
```

Start the client:
```bash
npm run dev
```

## 📁 Project Structure

### Backend Structure
```
backend/
├── configs/           # Database and Cloudinary configuration
├── controllers/       # Request handlers for various routes
│   └── admin/        # Admin-specific controllers
├── middleware/        # Authentication, rate limiting, file uploads
├── models/           # Mongoose schemas (User, Product, Order, etc.)
├── routes/           # API endpoints
│   └── admin/        # Admin routes
├── utils/            # Utilities (email, token generation, logging)
├── tests/            # Unit and integration tests
└── server.js         # Main application entry point
```

### Admin Dashboard Structure
```
admin/src/
├── components/       # Reusable UI components
│   └── layout/      # Layout components
├── context/          # React context (Auth, Product)
├── pages/            # Page components (Dashboard, Products, Orders, etc.)
├── routes/           # Protected routes
├── services/         # API service calls
└── utils/            # Helper functions and constants
```

### Client Structure
```
client/src/
├── components/       # Reusable UI components
├── context/          # React context providers
├── hooks/            # Custom React hooks
├── pages/            # Page components
├── types/            # TypeScript/JSDoc type definitions
└── utils/            # Utility functions and constants
```

## 🔐 API Endpoints

Key API endpoints available:

- **Authentication**: `/api/user/login`, `/api/user/signup`, `/api/user/logout`
- **Products**: `/api/products` (GET, POST, UPDATE, DELETE)
- **Categories**: `/api/categories` (GET, POST, UPDATE, DELETE)
- **Orders**: `/api/orders` (GET, POST, UPDATE)
- **Users**: `/api/user` (GET, POST, UPDATE)
- **Transactions**: `/api/transactions` (GET)
- **Limited Offers**: `/api/limited-offers` (GET, POST, UPDATE, DELETE)
- **M-Pesa**: `/api/mpesa/payment` (POST)
- **Admin**: `/api/admin/*` (GET, POST, UPDATE, DELETE)

## 🧪 Testing

Run backend tests:
```bash
cd backend
npm test              # Run tests once
npm run test:watch   # Run tests in watch mode
npm run test:coverage # Generate coverage report
```

Test coverage report is available in `backend/coverage/lcov-report/index.html`

## 🚢 Deployment

All three applications are configured for Vercel deployment:

1. **Backend**: Deploy to Vercel (Node.js)
2. **Admin**: Deploy to Vercel (Vite static site)
3. **Client**: Deploy to Vercel (Vite static site)

Each folder contains a `vercel.json` configuration file.

## 📝 Scripts

### Backend
- `npm run dev` - Start development server with auto-reload
- `npm test` - Run test suite
- `npm run test:coverage` - Generate test coverage report

### Admin & Client
- `npm run dev` - Start Vite development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## 🔒 Security Features

- JWT-based authentication
- Role-based access control (Admin/User)
- Password hashing with bcrypt
- Rate limiting middleware
- CORS protection
- Input validation
- OTP-based security
- Secure cookie handling

## 📊 Monitoring & Logging

- Comprehensive logging system for backend operations
- Error tracking and logging
- Request/response logging
- Email service for notifications

## 🤝 Contributing

1. Create a feature branch
2. Make your changes
3. Run linting: `npm run lint`
4. Test your changes: `npm test`
5. Submit a pull request

## 📄 License

ISC

## 👨‍💻 Author

Eugen Projects

## 📞 Support

For issues and questions, please create an issue in the repository.

---

**Last Updated**: December 29, 2025
