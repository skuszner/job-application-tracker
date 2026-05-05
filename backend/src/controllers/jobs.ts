import type { Request, Response } from "express";
import { prisma } from "../prisma/client.ts";
import type { AuthenticatedRequest } from "../types.ts";

export async function createJob(req: Request, res: Response) {
  const { company, role, status, notes, appliedDate } = req.body;
  const user = (req as AuthenticatedRequest).user;

  try {
    const job = await prisma.job.create({
      data: {
        company,
        role,
        status,
        notes: notes ?? null,
        appliedDate: new Date(appliedDate),
        user: { connect: { id: user.id } }
      }
    });

    res.status(201).json(job);
  } catch {
    res.status(500).json({ error: "Internal server error." });
  }
}

export async function getJobs(req: Request, res: Response) {
  const user = (req as AuthenticatedRequest).user;

  try {
    const jobs = await prisma.job.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: "desc" }
    });

    res.status(200).json(jobs);
  } catch {
    res.status(500).json({ error: "Internal server error." });
  }
}

export async function getJobById(req: Request, res: Response) {
  const { id } = req.params as { id: string };
  const user = (req as AuthenticatedRequest).user;

  try {
    const job = await prisma.job.findUnique({ where: { id } });
    if (!job) return res.status(404).json({ error: "Job not found." });
    if (job.userId !== user.id)
      return res.status(403).json({ error: "Forbidden" });

    res.status(200).json(job);
  } catch {
    res.status(500).json({ error: "Internal server error." });
  }
}

export async function updateJob(req: Request, res: Response) {
  const { id } = req.params as { id: string };
  const { company, role, status, notes, appliedDate } = req.body;
  const user = (req as AuthenticatedRequest).user;

  try {
    const existing = await prisma.job.findUnique({ where: { id } });
    if (!existing) return res.status(404).json({ error: "Job not found." });
    if (existing.userId !== user.id)
      return res.status(403).json({ error: "Forbidden" });

    const job = await prisma.job.update({
      where: { id },
      data: {
        company: company ?? existing.company,
        role: role ?? existing.role,
        status: status ?? existing.status,
        notes: typeof notes === "undefined" ? existing.notes : notes,
        appliedDate: appliedDate ? new Date(appliedDate) : existing.appliedDate
      }
    });

    res.status(200).json(job);
  } catch {
    res.status(500).json({ error: "Internal server error." });
  }
}

export async function deleteJob(req: Request, res: Response) {
  const { id } = req.params as { id: string };
  const user = (req as AuthenticatedRequest).user;

  try {
    const existing = await prisma.job.findUnique({ where: { id } });
    if (!existing) return res.status(404).json({ error: "Job not found." });
    if (existing.userId !== user.id)
      return res.status(403).json({ error: "Forbidden" });

    await prisma.job.delete({ where: { id } });
    res.status(204).send();
  } catch {
    res.status(500).json({ error: "Internal server error." });
  }
}
