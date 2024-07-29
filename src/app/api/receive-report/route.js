import nodemailer from "nodemailer";
import puppeteer from 'puppeteer';
import path from 'path';
import fs from 'fs';

export default async function handler(req, res) {
    if (req.method === "POST") {
        const { email, auditReport } = req.body;
        console.log("Données reçues:", { email, auditReport });

        if (!email || !auditReport) {
            return res.status(400).json({ message: 'Email and audit report are required' });
        }

        try {
            const domainName = "audit-report";
            const time = new Date().toISOString().replace(/[:.]/g, '-');

            // Enregistrer les résultats de l'audit dans un fichier JSON
            const auditReportPath = path.join(process.cwd(), `audit-report-${domainName}-${time}.json`);
            fs.writeFileSync(auditReportPath, JSON.stringify(auditReport, null, 2));
            console.log(`Rapport d'audit enregistré dans : ${auditReportPath}`);

            // Fonction pour générer un PDF à partir des données de l'audit
            const generatePdf = async (data) => {
                const browser = await puppeteer.launch({
                    args: ['--no-sandbox', '--disable-setuid-sandbox'],
                    headless: true,
                });
                const page = await browser.newPage();
                await page.setContent(`<h1>Rapport d'Audit</h1><pre>${JSON.stringify(data, null, 2)}</pre>`, { waitUntil: 'networkidle0' });
                const reportPdfPath = path.join(process.cwd(), `report-${domainName}-${time}.pdf`);
                await page.pdf({ path: reportPdfPath, format: 'A4' });
                await browser.close();
                return reportPdfPath;
            };

            const reportPdfPath = await generatePdf(auditReport);

            const transporter = nodemailer.createTransport({
                service: "hotmail",
                auth: {
                    user: process.env.EMAIL_USER,
                    pass: process.env.EMAIL_PASS,
                },
            });

            const attachments = [{
                filename: path.basename(reportPdfPath),
                path: reportPdfPath
            }];

            const mailOptions = {
                from: process.env.EMAIL_USER,
                to: email,
                subject: "Rapport d'Audit Lighthouse",
                html: `<h1>Bonjour</h1><br><p>Veuillez trouver le rapport d'audit Lighthouse en pièce jointe.</p><p>Bien cordialement</p>`,
                attachments: attachments
            };

            transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                    console.error("Erreur lors de l'envoi de l'email:", error);
                    res.status(500).json({ error: "Erreur lors de l'envoi de l'email" });
                } else {
                    console.log("Email envoyé:", info.response);
                    res.status(200).json({ message: "Email envoyé avec succès", auditReport });
                }
            });

        } catch (error) {
            console.error("Erreur lors de la génération du rapport ou de l'envoi de l'email:", error);
            res.status(500).json({ error: "Erreur lors de la génération du rapport ou de l'envoi de l'email" });
        }
    } else {
        res.status(405).json({ error: `Méthode ${req.method} non autorisée.` });
    }
}
