// middlewares/authMiddleware.js
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import redis from "../config/redisClient.js";

const protect = async (req, res, next) => {
  try {
    const token = req.headers.authorization;

    if (!token) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    // 1. Check if token is blacklisted (logged out tokens)
    const isBlacklisted = await redis.get(`blacklist:${token}`);
    if (isBlacklisted) {
      return res.status(401).json({ message: "Token has been invalidated. Please login again." });
    }

    // 2. Verify JWT
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 3. Check Redis cache for user before hitting MongoDB
    const cacheKey = `user:${decoded.id}`;
    const cachedUser = await redis.get(cacheKey);

    if (cachedUser) {
      // ✅ Cache HIT — no MongoDB query needed
      req.userId = decoded.id;
      req.user = JSON.parse(cachedUser);
      return next();
    }

    // 4. Cache MISS — fetch from MongoDB and cache it
    const user = await User.findById(decoded.id).select("-password");
    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    // Cache user for 15 minutes
    await redis.set(cacheKey, JSON.stringify(user), { EX: 900 });

    req.userId = decoded.id;
    req.user = user;
    next();

  } catch (error) {
    return res.status(401).json({ message: "Invalid token", error: error.message });
  }
};

export default protect;