import jwt from "jsonwebtoken";


const generateToken = (payload, rememberMe = false) => {
  if (!payload?.id) {
    throw new Error("Token payload must contain admin id");
  }

  const token = jwt.sign(
    {
      id: payload.id,
      role: payload.role,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: rememberMe ? "30d" : "1d",
      issuer: "e-commerce-platform",
      audience: "admin",
    }
  );

  return token;
};

export default generateToken;
