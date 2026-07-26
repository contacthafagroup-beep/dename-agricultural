import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { to, name, subject, reply } = await request.json();
    if (!to || !reply) return NextResponse.json({ message: "Missing fields" }, { status: 400 });

    const { Resend } = await import("resend");
    const resend = new Resend(process.env.RESEND_API_KEY);

    await resend.emails.send({
      from: "Dename Agricultural Support <contact.dename@gmail.com>",
      to,
      subject: `Re: ${subject}`,
      html: `
        <div style="font-family:sans-serif;max-width:600px">
          <div style="background:#1B5E20;padding:20px 24px;border-radius:12px 12px 0 0">
            <h2 style="color:white;margin:0;font-size:18px">Reply from Dename Agricultural Support</h2>
          </div>
          <div style="padding:24px;border:1px solid #e5e7eb;border-radius:0 0 12px 12px">
            <p>Dear ${name},</p>
            <p>Thank you for contacting us. Here is our response to your inquiry:</p>
            <div style="background:#f7f7f5;padding:16px;border-radius:8px;margin:16px 0">
              <p style="margin:0">${reply.replace(/\n/g, "<br>")}</p>
            </div>
            <p>If you have further questions, please don't hesitate to reach out.</p>
            <p>Best regards,<br/><strong>Dename Agricultural Supplier Team</strong><br/>
            📧 contact.dename@gmail.com | 📱 +251 954 742 383</p>
          </div>
        </div>`,
    });

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ message: "Email send failed" }, { status: 500 });
  }
}
