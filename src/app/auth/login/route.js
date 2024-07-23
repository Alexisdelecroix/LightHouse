import bcrypt from 'bcryptjs'
import { PrismaClient } from '@prisma/client'
import jwt from 'jsonwebtoken'

import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function POST(request) {

    try {
        // Récupération des données du corps de la requête
        const { email, password } = await request.json();

        // Recherche de l'utilisateur dans la base de données par email
        const user = await prisma.user.findUnique({
            where: { email },
        });

        if (user && bcrypt.compareSync(password, user.password)) {
            // Génération d'un token JWT
            const token = jwt.sign(
                { id: user.id, email: user.email }, // Payload du token
                process.env.JWT_SECRET, // Clé secrète pour signer le token
                { expiresIn: '1h' } // Expiration du token
            );
            return NextResponse.json({ token })
        }
        else {
            return NextResponse.json({ message: 'Email ou password invalide' }, { status: 401 });
        }
    } catch (error) {
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
    }
}