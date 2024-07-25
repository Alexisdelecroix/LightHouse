import { PrismaClient } from "@prisma/client";
import jwt from 'jsonwebtoken';
import { launch } from "chrome-launcher";

// import lighthouse from "lighthouse";
import { NextResponse } from "next/server";



const prisma = new PrismaClient();


function getUserIdFromToken(token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      return decoded.id;
    } catch (error) {
      if (error instanceof jwt.JsonWebTokenError) {
        console.error('Erreur lors de la vérification du token:', error.message);
      } else {
        console.error('Erreur inattendue lors de la vérification du token:', error.message);
      }
      return null;
    }
  }

export async function POST(request) {
    try {
        const { url } = await request.json();

        if (!url) {
            return NextResponse.json({ error: "URL manquante dans la requête." }, { status: 400 });
        }

        console.log('Requested URL:', url);

        let userId = null;
        let lastReport = null;
        let chrome = null;

         // Vérification de la présence du token
         const authHeader = request.headers.get('authorization');
         if (authHeader) {
             const token = authHeader.split(' ')[1];
             console.log('Token:', token);  // Ajout de journalisation
             userId = getUserIdFromToken(token);
             console.log('User ID from token:', userId);
 
             if (!userId) {
                 console.log('Token invalide ou expiré, utilisateur invité.');
             }
         }

         // Fonction pour générer les scores à partir de Lighthouse
    const generateScores = async (url, options) => {
        console.log('Starting Lighthouse...');
        const runnerResult = await lighthouse(url, options);
  
        const performance = runnerResult.lhr.categories.performance.score * 100;
        const seo = runnerResult.lhr.categories.seo.score * 100;
        const bestPractices =
          runnerResult.lhr.categories["best-practices"].score * 100;
        const accessibility =
          runnerResult.lhr.categories.accessibility.score * 100;
  
        return { performance, seo, bestPractices, accessibility };
      };
  
      try {
        chrome = await launch({ chromeFlags: ["--headless"] });
  
        const desktopOptions = {
          logLevel: "info",
          output: "html",
          onlyCategories: [
            "performance",
            "accessibility",
            "best-practices",
            "seo",
          ],
          port: chrome.port,
          formFactor: "desktop",
          screenEmulation: {
            mobile: false,
            width: 1350,
            height: 940,
            deviceScaleFactor: 1,
            disabled: false,
          },
        };
  
        if (userId) {
          // Récupérer uniquement l'ID du dernier rapport créé
          lastReport = await prisma.report.findFirst({
            orderBy: { createdAt: "desc" },
            select: { id: true },
          });
  
          if (!lastReport) {
            throw new Error("Aucun rapport trouvé.");
          }
          console.log("Dernier rapport ID:", lastReport.id);
        }

        const desktopScores = await generateScores(url, desktopOptions);

        // Enregistrer les scores uniquement si l'utilisateur est connecté
        if (userId) {
          await prisma.desktopPerformanceScore.create({
            data: {
              reportId: lastReport.id, // Utilisez l'ID du dernier rapport
              performance: desktopScores.performance,
              seo: desktopScores.seo,
              accessibility: desktopScores.accessibility,
              bestpractices: desktopScores.bestPractices,
            },
          });
        }
  
        // res.status(200).json(desktopScores);
        return NextResponse.json(desktopScores, {status : 200})

    } catch (error) {
        console.error("Erreur lors de l'analyse Lighthouse:", error);
        // res.status(500).json({
        //   error:
        //     "Erreur lors de la génération des données de performance desktop.",
        // });

        return NextResponse.json({erreur : "Erreur lors de la génération des données de performance desktop."}, {status : 500})
      } finally {
        if (chrome) {
          await chrome.kill();
        } 
    }
    } catch (error) {
        console.error('Erreur lors du traitement de la requête:', error); 
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
    }
}