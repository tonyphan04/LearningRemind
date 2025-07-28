import { Request, Response } from "express";
import { prisma } from "../services/prisma";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { authSchema, changePasswordSchema } from "../validation/auth.validation";

export const login = async (req: Request, res: Response) => {
  try {
    const parseResult = authSchema.safeParse(req.body);
    if (!parseResult.success) {
      return res.status(400).json({ error: parseResult.error.flatten().fieldErrors });
    }
    const { username, password } = parseResult.data;

    const user = await prisma.user.findUnique({
      where: { email: username },
    });

    if (!user) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.JWT_SECRET || "secret-key",
      { expiresIn: "7d" }
    );

    return res.status(200).json({ message: "Login successful", token });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
}

export const signup = async (req: Request, res: Response) => {
  try {
    const parseResult = authSchema.safeParse(req.body);
    if (!parseResult.success) {
      return res.status(400).json({ error: parseResult.error.flatten().fieldErrors });
    }
    const { username, password } = parseResult.data;

    const existingUser = await prisma.user.findUnique({
      where: { email: username },
    });

    if (existingUser) {
      return res.status(409).json({ error: "User already exists" });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const newUser = await prisma.user.create({
      data: {
        email: username,
        passwordHash,
      },
    });

    // Generate JWT token
    const token = jwt.sign(
      { userId: newUser.id, email: newUser.email },
      process.env.JWT_SECRET || "secret-key",
      { expiresIn: "7d" }
    );

    return res.status(201).json({ message: "Signup successful", token });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
}

// Middleware to get user from JWT
// export const getCurrentUser = async (req: Request, res: Response) => {
//   try {
//     const authHeader = req.headers.authorization;
//     if (!authHeader || !authHeader.startsWith("Bearer ")) {
//       return res.status(401).json({ error: "No token provided" });
//     }
//     const token = authHeader.split(" ")[1];
//     let payload: any;
//     try {
//       payload = jwt.verify(token, process.env.JWT_SECRET || "secret-key");
//     } catch {
//       return res.status(401).json({ error: "Invalid token" });
//     }
//     const user = await prisma.user.findUnique({ where: { id: payload.userId }, select: { id: true, email: true } });
//     if (!user) return res.status(404).json({ error: "User not found" });
//     return res.status(200).json({ user });
//   } catch (err: any) {
//     return res.status(500).json({ error: err.message });
//   }
// };

export const changePassword = async (req: Request, res: Response) => {
  try {
    const parseResult = changePasswordSchema.safeParse(req.body);
    if (!parseResult.success) {
      return res.status(400).json({ error: parseResult.error.flatten().fieldErrors });
    }
    const { oldPassword, newPassword } = parseResult.data;

    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ error: "No token provided" });
    }
    const token = authHeader.split(" ")[1];
    let payload: any;
    try {
      payload = jwt.verify(token, process.env.JWT_SECRET || "secret-key");
    } catch {
      return res.status(401).json({ error: "Invalid token" });
    }
    const user = await prisma.user.findUnique({ where: { id: payload.userId } });
    if (!user) return res.status(404).json({ error: "User not found" });
    // Verify old password
    const valid = await bcrypt.compare(oldPassword, user.passwordHash);
    if (!valid) return res.status(401).json({ error: "Old password is incorrect" });
    
    const newHash = await bcrypt.hash(newPassword, 10);
    await prisma.user.update({ where: { id: user.id }, data: { passwordHash: newHash } });
    return res.status(200).json({ message: "Password changed successfully" });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
};