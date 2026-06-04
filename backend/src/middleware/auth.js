import jwt from 'jsonwebtoken';
export const authenticate = (req, res, next) => {
  const token = req.header('Authorization')?.split(' ')[1];
  if (!token) {
    res.status(401).json({
      message: 'No token, authorization denied'
    });
    return;
  }
  try {
    const secret = process.env.JWT_SECRET || 'fallback_secret';
    const decoded = jwt.verify(token, secret);
    req.userId = decoded.userId;
    next();
  } catch (err) {
    res.status(401).json({
      message: 'Token is not valid'
    });
  }
};