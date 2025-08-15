import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import authRoutes from './routes/authRoutes.js'
import notificationRoutes from './routes/notificationRoutes.js'
import tenantRoutes from './routes/tenantRoutes.js'
import { authMiddleware } from './middleware/auth.js'
import { setupDatabase } from './dbSetup.js'

const app = express()
const port = process.env.PORT || 5000

app.use(cors({
  origin: [
    /^http:\/\/.*\.localhost:3000/, // allows subdomains like abc.localhost:3000
    'http://localhost:3000',
  ],
  credentials: true,
}))

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())


// Health check endpoint
app.get('/api/health', (req, res) => {
  console.log("/health")
  res.status(200).json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV 
  });
});
// Bypass auth for tenant routes bcz it has own auth middleware
app.use('/api/tenant', tenantRoutes)
// middleware
app.use(authMiddleware)
// // Routes
app.use('/api/auth', authRoutes)
app.use('/api/notifications', notificationRoutes)

app.listen(port, async () => {
    await setupDatabase();
    console.log(`Server is running on port ${port}`);
});
