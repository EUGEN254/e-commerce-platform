import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'

dotenv.config()

const generateToken = (user, rememberMe = false) => {
    // Only generate token for verified users
    if (!user.isVerified) {
        throw new Error("Cannot generate token for unverified user");
    }
    
    return jwt.sign(
        { 
            id: user._id,
            isVerified: user.isVerified // Include verification status in token
        },
        process.env.JWT_SECRET,
        { expiresIn: rememberMe ? "30d" : "1d" } 
    );
};

export default generateToken;