import jwt from "jsonwebtoken";
import type { NextFunction, Request, Response } from "express";

type AuthenticatedRequest = Request & {
  user: {
    id: string;
    email: string;
  };
};

export function authMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const header = req.headers.authorization;
  if (!header) return res.status(401).json({ error: "Unauthorized" });

  const token = header.split(" ")[1];

  try {
    const decoded = jwt.verify(token as string, process.env.JWT_SECRET!) as {
      id: string;
      email: string;
    };

    (req as AuthenticatedRequest).user = {
      id: decoded.id,
      email: decoded.email
    };

    next();
  } catch {
    return res.status(401).json({ error: "Invalid token" });
  }
}
