import { verifyToken } from "../utils/jwt.js";
import User from "../models/User.js";

const  authMiddleware = async(req, res, next) => {
  try {
    let token;

    if (req.headers.authorization?.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }
    else if (!token && req.cookies?.token) {
      token = req.cookies.token;
    }

    if (!token) return res.status(401).json({ error: 'No token provided' });

    const decoded = verifyToken(token);
    if (!decoded || !decoded.id) return res.status(401).json({ error: 'Invalid token' });

    
    const user = await User.findById(decoded.id).select('-password'); // exclude password
    if (!user) return res.status(401).json({ error: 'User not found' });

    req.user = user; 
    next();

  } catch (err) {
    console.error('AuthMiddleware Error:', err);
    res.status(401).json({ error: 'Not authorized' });
  }
}

export {authMiddleware};