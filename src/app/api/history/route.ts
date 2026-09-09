import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ videos: [] });
  }
  const videos = await prisma.video.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
    take: 20,
  });
  return NextResponse.json({ videos });
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Non connecté." }, { status: 401 });
  }
  const { topic, videoUrl } = await req.json();
  if (!topic || !videoUrl) {
    return NextResponse.json({ error: "topic et videoUrl requis." }, { status: 400 });
  }
  const video = await prisma.video.create({ data: { userId: session.user.id, topic, videoUrl } });
  return NextResponse.json({ video });
}