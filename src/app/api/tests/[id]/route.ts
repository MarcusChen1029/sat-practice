import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(_req: Request, { params }: { params: { id: string } }) {
  const s = await prisma.testSession.findUnique({ where: { id: params.id } });
  if (!s) return NextResponse.json({ error: "not found" }, { status: 404 });
  const elapsed = Math.floor((Date.now() - s.startedAt.getTime()) / 1000);
  const remaining = Math.max(0, s.durationSec - elapsed);
  return NextResponse.json({ ...s, remainingSec: remaining });
}
