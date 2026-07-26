import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, phone, company, subject, message } = body;

    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        { message: "Required fields missing" },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    const { data, error } = await supabase
      .from("messages")
      .insert({ name, email, phone, company, subject, message })
      .select()
      .single();

    if (error) {
      return NextResponse.json(
        { message: "Failed to send message" },
        { status: 500 }
      );
    }

    // Send confirmation email
    try {
      const { Resend } = await import("resend");
      const resend = new Resend(process.env.RESEND_API_KEY);

      await resend.emails.send({
        from: "Dename Agricultural <contact.dename@gmail.com>",
        to: email,
        subject: "Message Received - Dename Agricultural Supplier",
        html: `
          <div style="font-family: sans-serif; max-width: 600px;">
            <h2>Thank you for contacting us, ${name}!</h2>
            <p>We have received your message and will get back to you within 24 hours.</p>
            <div style="background: #f7f7f5; padding: 16px; border-radius: 8px;">
              <p><strong>Subject:</strong> ${subject}</p>
              <p><strong>Message:</strong> ${message}</p>
            </div>
            <p>Best regards,<br/>Dename Agricultural Supplier Team</p>
          </div>
        `,
      });
    } catch (emailError) {
      console.error("Email notification failed:", emailError);
    }

    return NextResponse.json({ success: true, data }, { status: 201 });
  } catch {
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
