import { NextResponse } from "next/server";
import { randomBytes } from "crypto";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { sendVerificationEmail } from "@/lib/email";

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Non connecté." }, { status: 401 });
  }

  const token = randomBytes(32).toString("hex");
  await prisma.verificationToken.create({
    data: { identifier: session.user.email, token, expires: new Date(Date.now() + 60 * 60 * 1000) },
  });

  const origin = new URL(req.url).origin;
  const verifyUrl = `${origin}/api/verify-email?token=${token}&email=${encodeURIComponent(session.user.email)}`;
  await sendVerificationEmail(session.user.email, verifyUrl);

  return NextResponse.json({ success: true });
}