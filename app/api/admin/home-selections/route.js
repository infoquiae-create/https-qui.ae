import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import authAdmin from "@/middlewares/authAdmin";

// GET: list all selections (admin)
export async function GET() {
  const { userId } = auth();
  const isAdmin = await authAdmin(userId);
  if (!isAdmin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const selections = await prisma.homeSelection.findMany({ orderBy: { sortOrder: "asc" } });
  return NextResponse.json({ selections });
}

// POST: create a new selection (admin)
export async function POST(req) {
  const { userId } = auth();
  const isAdmin = await authAdmin(userId);
  if (!isAdmin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const body = await req.json();
    const {
      section = "custom",
      title = "Untitled Section",
      subtitle,
      productIds = [],
      slides = [],
      bannerCtaText,
      bannerCtaLink,
      layout = "deals_with_banner",
      isActive = true,
      sortOrder = 0,
    } = body;

    const created = await prisma.homeSelection.create({
      data: {
        section,
        title,
        subtitle,
        productIds,
        slides,
        bannerCtaText,
        bannerCtaLink,
        layout,
        isActive,
        sortOrder,
      },
    });

    return NextResponse.json({ selection: created });
  } catch (error) {
    console.error("Create home selection error", error);
    return NextResponse.json({ error: "Failed to create selection" }, { status: 500 });
  }
}
