import jwt from 'jsonwebtoken';

export const superadminAuth = async (req, res, next) => {
    const token = req.cookies?.accessToken;
    if (!token) {
      const headers = req.headers.authorization || '';
      token = headers.startsWith('Bearer ') ? headers.slice(7) : null;
    }
    if (!token) {
        return res.status(401).json({ error: 'Unauthorized, Token not found' });
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'enc');
        if (decoded.role !== 'Super Admin') {
          return res.status(403).json({ error: 'Forbidden, User is not a superadmin' });
        }
        req.user = decoded;
        next();
    } catch (error) {
        console.log(error);
        if (error.message === 'jwt expired') {
            return res.status(401).json({ error: 'Unauthorized, Token expired' });
        } else if (error.message === 'jwt malformed') {
            return res.status(401).json({ error: 'Unauthorized, Invalid token' });
        }
        return res.status(500).json({ error: 'Internal server error' });
    }
}
