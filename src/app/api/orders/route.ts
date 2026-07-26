import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { generateOrderNumber } from "@/lib/utils";

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const body = await request.json();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    const orderNumber = generateOrderNumber();

    const orderData = {
      order_number: orderNumber,
      user_id: user?.id || null,
      product_id: body.product_id,
      company_name: body.company_name,
      contact_person: body.contact_person,
      email: body.email,
      phone: body.phone,
      whatsapp: body.whatsapp || null,
      country: body.country,
      address: body.address,
      grade: body.grade,
      quantity: parseFloat(body.quantity),
      unit: body.unit || "MT",
      packaging: body.packaging,
      delivery_destination: body.delivery_destination,
      preferred_delivery_date: body.preferred_delivery_date,
      shipping_method: body.shipping_method,
      special_requirements: body.special_requirements || null,
      status: "pending_review",
    };

    const { data: order, error } = await supabase
      .from("orders")
      .insert(orderData)
      .select()
      .single();

    if (error) {
      console.error("Order creation error:", error);
      return NextResponse.json(
        { message: "Failed to create order", error: error.message },
        { status: 500 }
      );
    }

    // Send email notification (if Resend is configured)
    try {
      const { Resend } = await import("resend");
      const resend = new Resend(process.env.RESEND_API_KEY);

      await resend.emails.send({
        from: "Dename Agricultural <tilahunmekbib345@gmail.com>",
        to: body.email,
        subject: `Order Received — Dename Agricultural Supplier - ${orderNumber}`,
        html: `
          <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background: #1B5E20; padding: 24px; border-radius: 12px 12px 0 0;">
              <h1 style="color: white; margin: 0; font-size: 22px;">Order Received — Dename Agricultural Supplier</h1>
            </div>
            <div style="padding: 24px; border: 1px solid #e5e7eb; border-radius: 0 0 12px 12px;">
              <p>Dear ${body.contact_person},</p>
              <p>Thank you for ordering from Dename Agricultural Supplier. We have received your order and our team will prepare a quotation with pricing for you shortly.</p>
              <div style="background: #f7f7f5; padding: 16px; border-radius: 8px; margin: 16px 0;">
                <p><strong>Order Number:</strong> ${orderNumber}</p>
                <p><strong>Product:</strong> ${body.grade}</p>
                <p><strong>Quantity:</strong> ${body.quantity} ${body.unit || "MT"}</p>
                <p><strong>Status:</strong> Pending Review</p>
              </div>
              <p>You will receive our quotation with pricing within 24 hours.</p>
              <p>Best regards,<br/>Dename Agricultural Supplier Team</p>
            </div>
          </div>
        `,
      });
    } catch (emailError) {
      console.error("Email sending failed:", emailError);
      // Don't fail the order if email fails
    }

    return NextResponse.json({ success: true, order }, { status: 201 });
  } catch (error) {
    console.error("Order API error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const supabase = await createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();

    let query = supabase
      .from("orders")
      .select(`
        *,
        product:products(name, grade, images)
      `)
      .order("created_at", { ascending: false });

    if (profile?.role !== "admin") {
      query = query.eq("user_id", user.id);
    }

    const { data: orders, error } = await query;

    if (error) {
      return NextResponse.json({ message: error.message }, { status: 500 });
    }

    return NextResponse.json({ orders });
  } catch (error) {
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
