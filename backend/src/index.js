import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import authRoutes from './routes/authRoutes.js'
import { authMiddleware } from './middleware/auth.js'
import notificationRoutes from './routes/notificationRoutes.js'
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

// middleware
app.use(authMiddleware)
// // Routes
app.use('/api/auth', authRoutes)
app.use('/api/notifications', notificationRoutes)

app.listen(port, async () => {
    await setupDatabase();
    console.log(`Server is running on port ${port}`);
});
