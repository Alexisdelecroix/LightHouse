import nodemailer from 'nodemailer';
import { NextResponse } from 'next/server';

export async function POST(request) {
  const { email, mobileReportUrl, desktopReportUrl } = await request.json();

  const user = process.env.EMAIL_USER;
  const pass = process.env.EMAIL_PASS;

  console.log(mobileReportUrl);
  console.log(desktopReportUrl);

  console.log(user);
  console.log(pass);

  if (!user || !pass) {
    return NextResponse.json({ error: 'Email user or password not set' }, { status: 500 });
  }

 const transporter = nodemailer.createTransport({
        service: "gmail",
        host: "smtp-relay.gmail.com",
        port: 465,
        secure: true,
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
  });

  try {
    let info = await transporter.sendMail({
      from: "Lighthouse CI",
      to: email,
      subject: 'Lighthouse CI Reports',
      html: `
        <p>Les rapports Lighthouse CI sont disponibles aux liens suivants :</p>
        <ul>
          <li><a href="${mobileReportUrl}">Rapport Mobile</a></li>
          <li><a href="${desktopReportUrl}">Rapport Desktop</a></li>
        </ul>
      `,
    });

    console.log('Message sent: %s', info.messageId);
    return NextResponse.json({ message: 'Email sent successfully' }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to send email' }, { status: 500 });
  }
}

