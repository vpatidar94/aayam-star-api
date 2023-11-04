const jwt = require('jsonwebtoken');

const secretKey = process.env.SECRET_KEY; // secret key

function generateToken(userId, mobileNo, type, orgCode = null) {
  const payload = { userId, mobileNo, type, orgCode };
 
  const options = { expiresIn: '6h' }; // Token expiration time

  return jwt.sign(payload, secretKey, options);
}

function verifyToken(req, res, next) {
  const token = req.headers.authorization;

  if (!token) {
    return res.status(401).json({ code: 401, status_code: "error", error: 'Token missing' });
  }

  jwt.verify(token, secretKey, (err, decoded) => {
    if (err) {
      return res.status(403).json({ code: 403, status_code: "error", error: 'Invalid token' });
    }
    
    // Token is valid, proceed to the next middleware or route
    req.user = decoded;
    next();
  });
}

function verifyAdminToken(req, res, next) {
  const token = req.headers.authorization;

  if (!token) {
    return res.status(401).json({ code: 401, status_code: "error", error: 'Token missing' });
  }

  jwt.verify(token, secretKey, (err, decoded) => {
    if (err) {
      return res.status(403).json({ code: 403, status_code: "error", error: 'Invalid token' });
    }

    if(!(decoded?.type === 'admin' || decoded?.type === 'org-admin')){
      return res.status(403).json({ code: 403, status_code: "error", error: 'Unauthorized user' });
    }

    // Token is valid, proceed to the next middleware or route
    req.user = decoded;
    next();
  });
}

function verifySuperAdminToken(req, res, next) {
  const token = req.headers.authorization;
  
  if (!token) {
    return res.status(401).json({ code: 401, status_code: "error", error: 'Token missing' });
  }

  jwt.verify(token, secretKey, (err, decoded) => {
    if (err) {
      return res.status(403).json({ code: 403, status_code: "error", error: 'Invalid token' });
    }

    if(decoded?.type !== 'admin'){
      return res.status(403).json({ code: 403, status_code: "error", error: 'Unauthorized user' });
    }

    // Token is valid, proceed to the next middleware or route
    req.user = decoded;
    next();
  });
}

module.exports = { generateToken, verifyToken, verifyAdminToken, verifySuperAdminToken }