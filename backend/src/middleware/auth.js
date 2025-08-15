import jwt from 'jsonwebtoken';
import db from '../config/db.js';

// Middleware to authenticate JWT token
export const authenticateToken = async (req, res, next) => {
  let token = req.cookies?.accessToken;
  if (!token) {
    const headers = req.headers.authorization || '';
    token = headers.startsWith('Bearer ') ? headers.slice(7) : null;
  }

  req.token = token;  // attached to be used in routesControllers
  // Bypass auth for login and register routes
  if (req.path === '/api/auth/login' || req.path === '/api/auth/register') {
    return next();
  }

  // Handle refresh token route
  if (req.path === '/api/auth/refresh') {
    token = req.cookies?.refreshToken || req.headers.authorization?.split(' ')[1];

    if (!token) return res.status(401).json({ error: 'Unauthorized! Token not found!' });
    req.token = token;
    return next();
  }

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "enc");
    
    // // Get user from database to ensure they still exist
    // const [rows] = await db.query('SELECT * FROM users WHERE user_id = ?', [decoded.userId]);
    // if (!rows || rows.length === 0) {
    //   return res.status(401).json({ error: 'User not found' });
    // }

    req.user = decoded;
    
    next();
  } catch (err) {
    if (err && err.message.includes('expired')){
      return res.clearCookie('accessToken').status(403).json({ error: 'Token expired!' });
    } else {
      console.log(err);
      return res.status(401).json({ error: 'Unauthorized! Token verification failed.' });
    }
  }
};

// Middleware to require super admin role
export const requireSuperAdmin = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ error: 'Authentication required' });
  }

  if (req.user.role !== 'Super Admin') {
    return res.status(403).json({ error: 'Super Admin access required' });
  }

  next();
};

// Middleware to require admin or super admin role
export const requireAdmin = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ error: 'Authentication required' });
  }

  if (req.user.role !== 'Super Admin' && req.user.role !== 'Admin') {
    return res.status(403).json({ error: 'Admin access required' });
  }

  next();
};