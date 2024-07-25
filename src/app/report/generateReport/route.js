import { PrismaClient } from "@prisma/client";
import jwt from 'jsonwebtoken';
import fetch from 'node-fetch';
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

// Fonction pour récupérer l'ID utilisateur à partir du token
function getUserIdFromToken(token) {
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log('Decoded JWT:', decoded);  // Ajout de journalisation
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

// Fonction pour vérifier si l'URL existe
const checkUrlExists = async (url) => {
    try {
        const response = await fetch(url, { method: 'HEAD' });
        return response.ok;
    } catch (error) {
        console.error("Erreur lors de la vérification de l'URL:", error);
        return false;
    }
};

// Fonction pour extraire le nom de domaine de l'URL
function getDomainName(url) {
    const domainPattern = /^(?:https?:\/\/)?(?:www\.)?([^\/]+)(?:\/|$)/i;
    const match = url.match(domainPattern);

    if (match && match[1]) {
        const domain = match[1].split('.').slice(0, -1).join('.');
        return domain;
    }
    return null;
}

export async function POST(request) {
    try {
        const { url } = await request.json();
        
        if (!url) {
            return NextResponse.json({ error: "URL manquante dans la requête." }, { status: 400 });
        }

        // Vérification de l'URL
        const urlExists = await checkUrlExists(url);
        if (!urlExists) {
            return NextResponse.json({ error: "L'URL fournie n'est pas valide ou accessible." }, { status: 400 });
        }

        let userId = null;

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

        const domainName = getDomainName(url);

        // Enregistrement du rapport dans la base de données
        if (userId) {
            await prisma.report.create({
                data: {
                    userId: userId,
                    siteName: domainName,
                }
            });
            console.log('Rapport enregistré dans la base de données.');
        } else {
            console.log('Utilisateur invité, rapport non enregistré dans la base de données.');
        }

        // Envoyer une réponse HTTP 200 OK après avoir traité la requête avec succès
        return NextResponse.json({
            message: 'Rapport généré avec succès',
            domainName
        }, { status: 200 });

    } catch (error) {
        console.error('Erreur lors du traitement de la requête:', error);
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
    }
}
