import nodemailer from 'nodemailer';
import { NextResponse } from 'next/server';

export async function POST(request) {

    const { email, mobileReportUrl, desktopReportUrl } = await request.json()

    let transporter = nodemailer.createTransport({
      service: 'hotmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    try {
      let info = await transporter.sendMail({
        from: '"Lighthouse CI" <noreply@example.com>',
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
      res.status(200).json({ message: 'Email sent successfully' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to send email' });
    }
  } 
