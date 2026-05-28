import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";

const BodySchema = z.object({ questionId: z.string(), note: z.string().optional() });

export async function POST(req: Request) {
  const parsed = BodySchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  const b = await prisma.bookmark.upsert({
    where: { questionId: parsed.data.questionId },
    create: { questionId: parsed.data.questionId, note: parsed.data.note },
    update: { note: parsed.data.note },
  });
  return NextResponse.json(b);
}
