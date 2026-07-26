import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: invoice, error } = await supabase
    .from("invoices")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !invoice) {
    return NextResponse.json({ message: "Invoice not found" }, { status: 404 });
  }

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Invoice ${invoice.invoice_number}</title>
      <style>
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { font-family: Arial, sans-serif; max-width: 800px; margin: 40px auto; padding: 0 20px; color: #333; }
        .header { background: #1B5E20; color: white; padding: 28px 32px; border-radius: 12px; margin-bottom: 28px; }
        .header h1 { font-size: 28px; font-weight: 700; letter-spacing: 2px; }
        .header p { margin-top: 6px; opacity: 0.8; font-size: 14px; }
        .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 28px; }
        .box { background: #f7f7f5; padding: 18px; border-radius: 10px; font-size: 14px; line-height: 1.6; }
        .box h3 { font-size: 11px; text-transform: uppercase; letter-spacing: 1.5px; color: #888; margin-bottom: 8px; }
        .box strong { color: #1B5E20; font-size: 15px; }
        table { width: 100%; border-collapse: collapse; margin-bottom: 28px; font-size: 14px; }
        thead { background: #f7f7f5; }
        th { padding: 12px 14px; text-align: left; font-size: 11px; text-transform: uppercase; letter-spacing: 1px; color: #666; }
        td { padding: 12px 14px; border-bottom: 1px solid #e5e7eb; }
        .totals { margin-left: auto; max-width: 280px; font-size: 14px; }
        .totals .row { display: flex; justify-content: space-between; padding: 6px 0; }
        .totals .grand { font-weight: 700; font-size: 18px; color: #1B5E20; border-top: 2px solid #1B5E20; margin-top: 8px; padding-top: 10px; }
        .status { display: inline-block; padding: 5px 14px; border-radius: 99px; font-size: 12px; font-weight: 600; text-transform: uppercase; margin-top: 32px; }
        .paid   { background: #d1fae5; color: #065f46; }
        .unpaid { background: #fee2e2; color: #991b1b; }
        .partial{ background: #fef3c7; color: #92400e; }
        .footer { margin-top: 40px; text-align: center; font-size: 12px; color: #aaa; border-top: 1px solid #e5e7eb; padding-top: 20px; }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>INVOICE</h1>
        <p>${invoice.invoice_number} &nbsp;&middot;&nbsp; Issued: ${new Date(invoice.created_at).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}</p>
      </div>

      <div class="grid">
        <div class="box">
          <h3>From</h3>
          <strong>Dename Agricultural Supplier</strong><br>
          Hosaena Sport Hotel<br>
          Hosaena, Ethiopia<br>
          contact.dename@gmail.com<br>
          +251 954 742 383
        </div>
        <div class="box">
          <h3>Bill To</h3>
          <strong>${invoice.customer_name}</strong><br>
          ${invoice.customer_company}<br>
          ${invoice.customer_address}<br>
          ${invoice.customer_email}
        </div>
      </div>

      <table>
        <thead>
          <tr>
            <th style="width:45%">Description</th>
            <th>Qty</th>
            <th>Unit</th>
            <th>Unit Price</th>
            <th>Total</th>
          </tr>
        </thead>
        <tbody>
          ${(invoice.items ?? []).map((item: { description: string; quantity: number; unit: string; unit_price: number; total: number }) => `
            <tr>
              <td>${item.description}</td>
              <td>${item.quantity}</td>
              <td>${item.unit}</td>
              <td>$${Number(item.unit_price).toFixed(2)}</td>
              <td>$${Number(item.total).toFixed(2)}</td>
            </tr>
          `).join("")}
        </tbody>
      </table>

      <div class="totals">
        <div class="row"><span>Subtotal</span><span>$${Number(invoice.subtotal).toFixed(2)}</span></div>
        ${Number(invoice.tax_amount) > 0 ? `<div class="row"><span>Tax (${invoice.tax_rate}%)</span><span>$${Number(invoice.tax_amount).toFixed(2)}</span></div>` : ""}
        <div class="row grand"><span>Grand Total</span><span>$${Number(invoice.grand_total).toFixed(2)} USD</span></div>
      </div>

      <div style="text-align:right;margin-top:16px">
        <span class="status ${invoice.payment_status}">${invoice.payment_status}</span>
        ${invoice.due_date ? `<p style="font-size:13px;color:#666;margin-top:8px">Due: ${new Date(invoice.due_date).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}</p>` : ""}
      </div>

      <div class="footer">
        <p>Dename Agricultural Supplier &middot; Hosaena, Ethiopia &middot; contact.dename@gmail.com</p>
        <p style="margin-top:4px">Thank you for your business.</p>
      </div>
    </body>
    </html>
  `;

  return new NextResponse(html, {
    headers: {
      "Content-Type": "text/html; charset=utf-8",
      "Content-Disposition": `inline; filename="invoice-${invoice.invoice_number}.html"`,
    },
  });
}
