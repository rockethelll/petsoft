// const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
import Stripe from "stripe";

import { prisma } from "@/lib/db";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);

export const POST = async (request: Request) => {
  const body = await request.text();
  const signature = request.headers.get("stripe-signature");

  // Verify webhook came from stripe
  let event;
  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature ?? "",
      process.env.STRIPE_WEBHOOK_SECRET as string,
    );
  } catch (error) {
    console.error("Webhook verification failed.", error);
    return Response.json(null, { status: 400 });
  }

  // Fullfill order
  if (event.type === "checkout.session.completed") {
    await prisma.user.update({
      where: {
        email: event.data.object.customer_email ?? undefined,
      },
      data: {
        hasAccess: true,
      },
    });
  } else {
    console.log(`Unhandled event type ${event.type}`);
  }

  // Return 200 status code
  return Response.json(null, { status: 200 });
};
