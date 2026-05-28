import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
  await prisma.bookmark.deleteMany({ where: { questionId: params.id } });
  return NextResponse.json({ ok: true });
}
