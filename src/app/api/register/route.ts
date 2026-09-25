import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { randomBytes } from "crypto";
import { prisma } from "@/lib/prisma";
import { sendVerificationEmail } from "@/lib/email";

export async function POST(req: NextRequest) {
  const { email, password } = await req.json();

  if (!email || !password || password.length < 8) {
    return NextResponse.json(
      { error: "Email et mot de passe (8 caractères minimum) requis." },
      { status: 400 }
    );
  }

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    return NextResponse.json({ error: "Un compte existe déjà avec cet email." }, { status: 409 });
  }

  const passwordHash = await bcrypt.hash(password, 10);
  await prisma.user.create({ data: { email, passwordHash, credits: 1 } });

  const token = randomBytes(32).toString("hex");
  await prisma.verificationToken.create({
    data: { identifier: email, token, expires: new Date(Date.now() + 60 * 60 * 1000) },
  });

  const origin = new URL(req.url).origin;
  const verifyUrl = `${origin}/api/verify-email?token=${token}&email=${encodeURIComponent(email)}`;

  try {
    await sendVerificationEmail(email, verifyUrl);
  } catch (err) {
    // On ne bloque pas l'inscription si l'envoi échoue — l'utilisateur pourra
    // redemander l'email de vérification depuis l'appli.
    console.error("Échec envoi email de vérification :", err);
  }

  return NextResponse.json({ success: true });
}