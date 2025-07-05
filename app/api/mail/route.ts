import { Resend } from "resend";
import { NextResponse } from "next/server";

const resend = new Resend(process.env.NEXT_PUBLIC_RESEND_API_KEY);

export async function POST(req: Request) {
  try {
    const { to, email, password } = await req.json();

    if (!to || !email || !password) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border-radius: 10px; border: 1px solid #e0e0e0;">
        <h2 style="color: #10b981;">Welcome to Steyp Newsletter Creator Account</h2>
        <p>Here are your login credentials:</p>
        <table style="width: 100%; margin-top: 16px;">
          <tr>
            <td style="font-weight: bold;">Email:</td>
            <td>${email}</td>
          </tr>
          <tr>
            <td style="font-weight: bold;">Password:</td>
            <td>${password}</td>
          </tr>
        </table>
        <p style="margin-top: 24px;">You can log in at <a href="https://your-app-domain.com" style="color: #10b981;">Steyp Newsletter Portal</a>.</p>
        <p style="color: #6b7280; font-size: 12px; margin-top: 24px;">If you did not expect this email, please ignore it.</p>
      </div>
    `;

    const data = await resend.emails.send({
      from: "Steyp <onboarding@resend.dev>",
      to,
      subject: "Your Steyp Newsletter Creator Credentials",
      html,
    });

    return NextResponse.json({ success: true, data });
  } catch (error) {
    return NextResponse.json({ error: error }, { status: 500 });
  }
}
