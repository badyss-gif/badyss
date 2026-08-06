import "server-only";
import { createHmac, timingSafeEqual } from "node:crypto";
import { revalidateTag } from "next/cache";
import { NextResponse } from "next/server";
import { getWooCommerceWebhookSecret } from "@/config/server-env";

// WooCommerce → Settings → Advanced → Webhooks delivers here on every
// product/order create, update, and delete. Each delivery is signed with
// HMAC-SHA256 (base64) of the exact raw request body using the webhook's
// secret — verifying it is the only thing standing between this endpoint
// and anyone on the internet triggering cache invalidation at will, so a
// missing/invalid signature is always rejected, never silently ignored.
// Docs: https://woocommerce.github.io/woocommerce-rest-api-docs/#webhooks

function isValidSignature(rawBody: string, signatureHeader: string, secret: string): boolean {
  const expected = createHmac("sha256", secret).update(rawBody, "utf8").digest("base64");
  const expectedBuffer = Buffer.from(expected);
  const receivedBuffer = Buffer.from(signatureHeader);
  return expectedBuffer.length === receivedBuffer.length && timingSafeEqual(expectedBuffer, receivedBuffer);
}

export async function POST(request: Request): Promise<NextResponse> {
  const secret = getWooCommerceWebhookSecret();
  if (!secret) {
    console.error("[woocommerce webhook] WOOCOMMERCE_WEBHOOK_SECRET is not set — rejecting delivery.");
    return NextResponse.json({ error: "webhook not configured" }, { status: 500 });
  }

  const signatureHeader = request.headers.get("x-wc-webhook-signature");
  if (!signatureHeader) {
    return NextResponse.json({ error: "missing signature" }, { status: 401 });
  }

  // Must read the body as raw text (not `.json()`) — signing happens over
  // the exact bytes WooCommerce sent, and re-serializing parsed JSON can
  // produce a byte-different (and therefore signature-mismatching) string.
  const rawBody = await request.text();
  if (!isValidSignature(rawBody, signatureHeader, secret)) {
    console.error("[woocommerce webhook] Signature mismatch — rejecting delivery.");
    return NextResponse.json({ error: "invalid signature" }, { status: 401 });
  }

  // e.g. "product.created", "product.updated", "product.deleted",
  // "product.restored", "order.created", "order.updated", "order.deleted".
  // The very first delivery after creating a webhook in wp-admin is a
  // signed test ping with topic "action.woocommerce_webhook_ping" (or no
  // topic on some WooCommerce versions) — it's handled the same way as any
  // other unrecognized topic below: signature already verified, so just
  // acknowledge it with 200 and skip revalidation.
  const topic = request.headers.get("x-wc-webhook-topic") ?? "";
  const revalidated: string[] = [];
  // `{ expire: 0 }` forces immediate expiration (the next request blocks on
  // a fresh fetch) instead of Next 16's default `profile: "max"`
  // stale-while-revalidate behavior — appropriate here since WooCommerce is
  // an external system telling us data already changed, not a routine
  // background refresh. See node_modules/next/dist/docs/.../revalidateTag.md.
  const immediate = { expire: 0 };

  if (topic.startsWith("product")) {
    revalidateTag("products", immediate);
    // WooCommerce has no dedicated category webhook topic — a product
    // create/update/delete can change a category's product count or
    // visibility, so refresh that tag too.
    revalidateTag("categories", immediate);
    revalidated.push("products", "categories");
  } else if (topic.startsWith("order")) {
    // An order consumes stock — refresh product data so "in stock"/"out of
    // stock" badges and quantity limits stay accurate right away.
    revalidateTag("products", immediate);
    revalidated.push("products");
  }

  return NextResponse.json({ ok: true, topic, revalidated });
}

// Lets you sanity-check in a browser that the route is deployed and
// reachable — WooCommerce itself only ever sends POST requests here.
export async function GET(): Promise<NextResponse> {
  return NextResponse.json({ ok: true, message: "WooCommerce webhook endpoint is live. Expecting POST." });
}
