import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { prisma } from "../prisma/client.ts";
import type { Request, Response } from "express";

interface AuthenticatedRequest extends Request {
  user: {
    id: string;
    email: string;
  };
}

export async function signup(req: Request, res: Response) {
  const { email, password } = req.body;

  const hashed = await bcrypt.hash(password, 10);

  try {
    const user = await prisma.user.create({
      data: {
        email,
        password: hashed
      }
    });

    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET!
    );

    res.status(201).json({ token });
  } catch (err) {
    if (
      typeof err === "object" &&
      err !== null &&
      "code" in err &&
      err.code === "P2002"
    ) {
      res.status(409).json({ error: "Email already exists" });
    } else {
      res.status(500).json({ error: "Internal server error" });
    }
  }
}

export async function login(req: Request, res: Response) {
  const { email, password } = req.body;

  const unauthorizedResponse = () => {
    return res.status(401).json({ error: "Invalid email or password" });
  };

  const user = await prisma.user.findUnique({
    where: { email }
  });
  if (!user) {
    return unauthorizedResponse();
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    return unauthorizedResponse();
  }

  const token = jwt.sign(
    { id: user.id, email: user.email },
    process.env.JWT_SECRET!
  );

  res.status(200).json({ token });
}

export async function me(req: Request, res: Response) {
  const user = (req as AuthenticatedRequest).user;
  res.status(200).json({ id: user.id, email: user.email });
}
