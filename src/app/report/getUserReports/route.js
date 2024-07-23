import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function GET(request) {
    try {
        const authHeader = request.headers.get('authorization');
        
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return NextResponse.json({ erreur: 'En-tête d\'autorisation manquante ou mal formée' }, { status: 400 });
        }
        
        const token = authHeader.split(' ')[1];

        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            const userId = decoded.id;

            const userReports = await prisma.report.findMany({
                where: { userId: userId },
                orderBy: { createdAt: 'desc' },
                include: { pdf: true }
            });

            return NextResponse.json({ reports: userReports }, { status: 200 });
        } catch (error) {
            console.error("Erreur lors du décodage du token ou de la récupération des rapports de l'utilisateur:", error);
            return NextResponse.json({ erreur: "Erreur lors du décodage du token ou de la récupération des rapports de l'utilisateur" }, { status: 500 });
        }
    } catch (error) {
        console.error("Erreur Interne du Serveur:", error);
        return NextResponse.json({ message: 'Erreur Interne du Serveur' }, { status: 500 });
    }
}
