import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { CREDIT_PACK, CAMERPAY_API_URL } from "@/lib/camerpay";

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Non connecté." }, { status: 401 });
  }

  const { phone, method } = await req.json();
  if (!phone || !method) {
    return NextResponse.json({ error: "Numéro et moyen de paiement requis." }, { status: 400 });
  }

  const txRef = `videmia-${session.user.id}-${Date.now()}`;
  const origin = new URL(req.url).origin;

  await prisma.payment.create({
    data: {
      userId: session.user.id,
      txRef,
      amount: CREDIT_PACK.amount,
      currency: CREDIT_PACK.currency,
      creditsGranted: CREDIT_PACK.credits,
      status: "pending",
    },
  });

  const res = await fetch(CAMERPAY_API_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.CAMERPAY_API_TOKEN}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      amount: CREDIT_PACK.amount,
      currency: CREDIT_PACK.currency,
      method, // "orange_money" ou "mtn_momo"
      customer_phone: phone,
      invoice_id: txRef,
      callback_url: `${origin}/api/camerpay/webhook`,
    }),
  });

  const data = await res.json();
  if (!data.pay_url) {
    return NextResponse.json({ error: data.message || "Impossible de démarrer le paiement." }, { status: 500 });
  }

  // On garde le lien entre notre référence et l'identifiant CamerPay
  await prisma.payment.update({ where: { txRef }, data: { status: "pending" } });

  return NextResponse.json({ link: data.pay_url });
}