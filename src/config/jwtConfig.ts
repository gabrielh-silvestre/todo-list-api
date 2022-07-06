import "dotenv/config";
import jwt from "jsonwebtoken";

type JwtConfig = {
  secret: jwt.Secret;
  expiresIn: jwt.SignOptions["expiresIn"];
  algorithm: jwt.Algorithm;
};

const jwtConfig: JwtConfig = {
  secret: process.env.JWT_SECRET,
  expiresIn: "3d",
  algorithm: "HS256",
} as JwtConfig;

export { jwtConfig };
