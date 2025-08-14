# Multi Tenant SaaS Dashboard

A modern, full-stack multi-tenant SaaS application built with Next.js, Express.js, and MySQL. This application provides a scalable dashboard solution with authentication, user management, and notification systems.

## 🚀 Features

- **Multi-tenant Architecture**: Isolated data and functionality for different organizations
- **Modern Authentication**: JWT-based authentication with secure cookie handling
- **Responsive Dashboard**: Clean, modern UI built with Next.js and Tailwind CSS
- **Real-time Notifications**: Notification system with real-time updates
- **Database Management**: MySQL database with Docker containerization
- **API-first Design**: RESTful API backend with Express.js
- **Type Safety**: Full TypeScript support in the frontend

## 🛠️ Tech Stack

### Frontend
- **Next.js 15** - React framework with App Router
- **React 19** - UI library
- **TypeScript** - Type safety
- **Tailwind CSS** - Utility-first CSS framework
- **Axios** - HTTP client
- **Lucide React** - Icon library

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **MySQL** - Database
- **JWT** - Authentication
- **bcrypt** - Password hashing
- **CORS** - Cross-origin resource sharing

### Infrastructure
- **Docker** - Containerization for MySQL database
- **Docker Compose** - Multi-container orchestration

## 📁 Project Structure

```
Multi Tenant App/
├── backend/                 # Express.js API server
│   ├── src/
│   │   ├── config/         # Database configuration
│   │   ├── controllers/    # Route controllers
│   │   ├── middleware/     # Custom middleware
│   │   ├── routes/         # API routes
│   │   ├── dbSetup.js      # Database initialization
│   │   └── index.js        # Server entry point
│   ├── docker-compose.yml  # Database container setup
│   └── package.json
├── frontend/               # Next.js application
│   ├── app/                # Next.js App Router pages
         ├── dashboard      # dashboard page
         └── auth           # login and register routes
│   ├── components/        # React components
│   ├── services/          # API services and utilities
│   └── package.json
└── README.md
```

## 🚀 Quick Start

### Prerequisites

- Node.js (v18 or higher)
- Docker and Docker Compose
- MySQL (via Docker)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/intZaibi/Multi-Tenant-App
   cd Multi-Tenant-App
   ```

2. **Start the database**
   ```bash
   cd backend
   docker-compose up -d
   ```

3. **Install backend dependencies**
   ```bash
   cd backend
   npm install
   ```

4. **Install frontend dependencies**
   ```bash
   cd frontend
   npm install
   ```

5. **Set up environment variables**

   Create `.env` files in both backend and frontend directories:

   **Backend (.env)**
   ```env
   PORT=5000
   NODE_ENV=development
   JWT_SECRET=your-jwt-secret-key
   DB_HOST=localhost
   DB_USER=root
   DB_PASSWORD=abcd
   DB_NAME=multi_tenant_saas
   ```

   **Frontend (.env.local)**
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:5000/api
   ```

6. **Start the development servers**

   **Backend (Terminal 1)**
   ```bash
   cd backend
   npm run dev
   ```

   **Frontend (Terminal 2)**
   ```bash
   cd frontend
   npm run dev
   ```

7. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000
   - Database: localhost:3306

## 📖 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `GET /api/auth/get-user` - Get current user

### Notifications
- `GET /api/notifications/get-notifications` - Get user notifications
- `POST /api/notifications/mark-as-read` - Create notification
- `GET /api/notifications/stats/overview` - Get notification count
- `GET /api/notifications/stats/tenant` - Get notification count (route for only admin)

### Health Check
- `GET /api/health` - API health status

## 🔧 Development

### Available Scripts

**Backend**
```bash
npm run dev      # Start development server with nodemon
npm start        # Start production server
```

**Frontend**
```bash
npm run dev      # Start development server
npm run build    # Build for production
npm start        # Start production server
npm run lint     # Run ESLint
```

### Database Setup

The application automatically sets up the database schema on first run. The database includes:

- Users table with multi-tenant support
- Notifications table
- Proper indexing and relationships

### Code Structure

- **Components**: Reusable UI components in `frontend/components/`
- **Pages**: Next.js pages in `frontend/app/`
- **Services**: API calls and utilities in `frontend/services/`
- **Controllers**: Business logic in `backend/src/controllers/`
- **Middleware**: Custom middleware in `backend/src/middleware/`

## 🔒 Security Features

- JWT-based authentication
- Password hashing with bcrypt
- CORS configuration
- Secure cookie handling
- Input validation and sanitization

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the ISC License.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Check the API documentation at `/api/health` endpoint
- Review the console logs for debugging information

## 🔄 Version History

- **v1.0.0** - Initial release with authentication and dashboard
- Multi-tenant support
- Notification system
- Modern UI with Tailwind CSS
