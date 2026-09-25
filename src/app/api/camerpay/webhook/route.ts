import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  const rawBody = await req.text();
  const signature = req.headers.get("x-camerpay-signature") || "";

  // Vérification de la signature HMAC-SHA256 : garantit que la notification
  // vient bien de CamerPay et pas d'un tiers qui voudrait s'offrir des crédits.
  const expected = crypto
    .createHmac("sha256", process.env.CAMERPAY_API_TOKEN!)
    .update(rawBody)
    .digest("hex");

  if (signature !== expected) {
    return NextResponse.json({ error: "Signature invalide." }, { status: 401 });
  }

  const payload = JSON.parse(rawBody);
  const txRef = payload.invoice_id;
  const status = payload.status;

  if (!txRef) {
    return NextResponse.json({ error: "Référence manquante." }, { status: 400 });
  }

  const payment = await prisma.payment.findUnique({ where: { txRef } });
  if (!payment || payment.status === "successful") {
    return NextResponse.json({ received: true });
  }

  if (status !== "completed") {
    await prisma.payment.update({ where: { txRef }, data: { status: "failed" } });
    return NextResponse.json({ received: true });
  }

  await prisma.$transaction([
    prisma.payment.update({ where: { txRef }, data: { status: "successful" } }),
    prisma.user.update({
      where: { id: payment.userId },
      data: { credits: { increment: payment.creditsGranted } },
    }),
  ]);

  return NextResponse.json({ received: true });
}