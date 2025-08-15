import jwt from 'jsonwebtoken';

export const authMiddleware = async (req, res, next) => {
  
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

  if (!token) return res.status(401).json({ error: 'Unauthorized! Token not found!' });
  try {
    jwt.verify(token, process.env.JWT_SECRET || "enc", (err, decoded) => {
      if (err) {
        return res.status(401).json({ error: 'Unauthorized! Token verification failed.' });
      }
      req.user = decoded;
      next();
    });
    // const user = jwt.decode(token);
    // if (user) {
    //   req.user = user;
    // } else {
    //   throw new Error("Token not found in db!");
    // }
    // next();
  } catch (err) {
    if (err && err.message.includes('expired')){
      return res.clearCookie('accessToken').status(403).json({ error: 'Token expired!' });
    } else {
      console.log(err);
      return res.status(401).json({ error: 'Unauthorized! Token verification failed.' });
    }
  }
};