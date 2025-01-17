import jwt from 'jsonwebtoken';

export const createAccessToken = (user) => {
  return jwt.sign(
    { 
      id: user._id,
      email: user.email,
      role: user.role 
    },
    process.env.JWT_SECRET,
    { expiresIn: '15m' }
  );
};

export const createRefreshToken = (user) => {
  return jwt.sign(
    { 
      id: user._id,
      email: user.email 
    },
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: '7d' }
  );
};

export const createAccessTokenForReset = (user) => {
  return jwt.sign(
    { 
      email: user.email 
    },
    process.env.JWT_SECRET,
    { expiresIn: '1h' }
  );
};