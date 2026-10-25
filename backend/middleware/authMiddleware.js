// authMiddleware
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const ApiError = require('../utils/ApiError');
const asyncHandler = require('../utils/asyncHandler');

module.exports = asyncHandler(async (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        throw new ApiError(401, 'No token provided');
    }

    const token = authHeader.split(' ')[1];
    let decoded;
    try {
        decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
        if (
            error instanceof jwt.JsonWebTokenError ||
            error instanceof jwt.NotBeforeError ||
            error instanceof jwt.TokenExpiredError
        ) {
            throw new ApiError(401, 'Invalid or expired token');
        }
        throw error;
    }

    const user = await User.findById(decoded.id).select('-password');


    if (!user) {
        throw new ApiError(401, 'User not found');
    }

    if (!user.emailVerified && !user.isVerified) {
        throw new ApiError(403, 'Please verify your email address to access this resource');
    }

    if (decoded.universityId && !user.universityId) {
        user.universityId = decoded.universityId;
    }

    req.user = user;
    next();
});
