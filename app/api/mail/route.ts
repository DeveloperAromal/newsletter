import nodemailer from "nodemailer";
import { NextResponse } from "next/server";

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
        <p style="margin-top: 24px;">You can log in at <a href="https://steyp-newsletter-creator.vercel.app/" style="color: #10b981;">Steyp Newsletter Portal</a>.</p>
        <p style="color: #6b7280; font-size: 12px; margin-top: 24px;">If you did not expect this email, please ignore it.</p>
      </div>
    `;

    // Create a Nodemailer transporter (use your SMTP credentials)
    const transporter = nodemailer.createTransport({
      host: process.env.NEXT_PUBLIC_SMTP_HOST, // e.g. smtp.gmail.com
      port: Number(process.env.NEXT_PUBLIC_SMTP_PORT) || 465,
      secure: true, // true for 465, false for other ports
      auth: {
        user: process.env.NEXT_PUBLIC_SMTP_USER,
        pass: process.env.NEXT_PUBLIC_SMTP_PASS,
      },
    });

    const info = await transporter.sendMail({
      from: `"Steyp" <${process.env.NEXT_PUBLIC_SMTP_USER}>`, // sender address
      to,
      subject: "Your Steyp Newsletter Creator Credentials",
      html,
    });

    return NextResponse.json({ success: true, messageId: info.messageId });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : error },
      { status: 500 }
    );
  }
}
