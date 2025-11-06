import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import authAdmin from "@/middlewares/authAdmin";

export async function GET(_req, { params }) {
  const { userId } = auth();
  const isAdmin = await authAdmin(userId);
  if (!isAdmin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const selection = await prisma.homeSelection.findUnique({ where: { id: params.id } });
  if (!selection) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ selection });
}

export async function PUT(req, { params }) {
  const { userId } = auth();
  const isAdmin = await authAdmin(userId);
  if (!isAdmin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const body = await req.json();
    const updated = await prisma.homeSelection.update({
      where: { id: params.id },
      data: body,
    });
    return NextResponse.json({ selection: updated });
  } catch (error) {
    console.error("Update selection error", error);
    return NextResponse.json({ error: "Failed to update selection" }, { status: 500 });
  }
}

export async function DELETE(_req, { params }) {
  const { userId } = auth();
  const isAdmin = await authAdmin(userId);
  if (!isAdmin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    await prisma.homeSelection.delete({ where: { id: params.id } });
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Delete selection error", error);
    return NextResponse.json({ error: "Failed to delete selection" }, { status: 500 });
  }
}
