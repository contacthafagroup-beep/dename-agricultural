import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { generateQuotationNumber } from "@/lib/utils";

export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single();
  if (profile?.role !== "admin") return NextResponse.json({ message: "Forbidden" }, { status: 403 });

  const body = await request.json();
  const { order_id, unit_price, transportation_cost = 0, tax_rate = 0, delivery_time, validity_period = "30 days", notes, product_name, quantity, unit } = body;

  const subtotal = quantity * unit_price + transportation_cost;
  const tax_amount = subtotal * (tax_rate / 100);
  const total = subtotal + tax_amount;

  const { data, error } = await supabase.from("quotations").insert({
    quotation_number: generateQuotationNumber(),
    order_id, product_name, quantity, unit, unit_price,
    transportation_cost, tax_rate, tax_amount, subtotal, total,
    delivery_time, validity_period, notes, status: "sent",
  }).select().single();

  if (error) return NextResponse.json({ message: error.message }, { status: 500 });

  // Update order status
  await supabase.from("orders").update({ status: "quotation_sent" }).eq("id", order_id);

  // Send email notification
  try {
    const { data: order } = await supabase.from("orders").select("email, contact_person").eq("id", order_id).single();
    if (order?.email) {
      const { Resend } = await import("resend");
      const resend = new Resend(process.env.RESEND_API_KEY);
      await resend.emails.send({
        from: "Dename Agricultural <tilahunmekbib345@gmail.com>",
        to: order.email,
        subject: `Quotation Ready — ${data.quotation_number}`,
        html: `<p>Dear ${order.contact_person},</p>
          <p>Your quotation <strong>${data.quotation_number}</strong> is ready.</p>
          <p><strong>Total: $${total.toFixed(2)} USD</strong></p>
          <p>Please log in to your account to review and accept the quotation.</p>
          <a href="${process.env.NEXT_PUBLIC_SITE_URL}/dashboard/quotations">View Quotation</a>`,
      });
    }
  } catch { /* email best-effort */ }

  return NextResponse.json({ success: true, quotation: data }, { status: 201 });
}
