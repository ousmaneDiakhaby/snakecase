import {NextRequest, NextResponse} from "next/server";
import {stripe} from "@/lib/stripe";
import {headers} from "next/headers";
import Stripe from "stripe";
import {db} from "@/db";

export async function POST(req: NextRequest) {
  try {
    const body = await req.text()
    const header = await headers()
    const signature = header.get("stripe-signature")

    if (!signature) {
      return new Response('No signature header sent', {status: 400})
    }

    const event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!,
    )

    if (event.type === "checkout.session.completed") {
      if (!event.data.object.customer_details?.email) {
        throw new Error('Missing user email')
      }

      const session = event.data.object as Stripe.Checkout.Session

      const {userId, orderId} = session.metadata || {
        userId: null,
        orderId: null
      }

      if (!userId || !orderId) {
        throw new Error('Invalid request metadata')
      }

      const billingAddress = session.customer_details!.address
      const shippingAddress = session.shipping_details!.address

      await db.order.update({
        where: {
          id: orderId,
        },
        data: {
          isPaid: true,
          shippingAddress: {
            create: {
              name: session.shipping_details!.name!,
              city: shippingAddress!.city!,
              country: shippingAddress!.country!,
              postalCode: shippingAddress!.postal_code!,
              street: shippingAddress!.line1!,
              state: shippingAddress!.state!,
            },
          },
          billingAddress: {
            create: {
              name: session.customer_details!.name!,
              city: billingAddress!.city!,
              country: billingAddress!.country!,
              postalCode: billingAddress!.postal_code!,
              street: billingAddress!.line1!,
              state: billingAddress!.state!,
            },
          },
        },
      })
    }

    return NextResponse.json({result: event, ok: true})
  } catch (err) {
    console.error(err)
    return NextResponse.json({message: "Something went wrong", ok: false},
      {status: 500}
    )
  }
}