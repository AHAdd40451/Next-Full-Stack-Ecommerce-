import jwt from 'jsonwebtoken';

export const verifyRefreshToken = (email, token) => {
  try {
    const decoded = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET);
    return decoded.email === email;
  } catch (error) {
    console.error('Refresh token verification error:', error);
    return false;
  }
};

export const refreshTokenMiddleware = async (request) => {
  try {
    const authHeader = request.headers.get('Authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      throw new Error('No refresh token provided');
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET);
    
    return decoded;
  } catch (error) {
    throw new Error('Invalid refresh token');
  }
};