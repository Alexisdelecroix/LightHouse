import bcrypt from 'bcryptjs';
import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

// Fonction pour vérifier la force du mot de passe
function isStrongPassword(password_admin) {
    const lengthCheck = password_admin.length >= 8;
    const lowercaseCheck = /[a-z]/.test(password_admin);
    const uppercaseCheck = /[A-Z]/.test(password_admin);
    const digitCheck = /\d/.test(password_admin);
    const specialCharCheck = /[@$!%*?&]/.test(password_admin);

    return {
        isValid: lengthCheck && lowercaseCheck && uppercaseCheck && digitCheck && specialCharCheck,
        lengthCheck: lengthCheck,
        lowercaseCheck: lowercaseCheck,
        uppercaseCheck: uppercaseCheck,
        digitCheck: digitCheck,
        specialCharCheck: specialCharCheck
    };
}

export async function POST(request) {
    try {
        // Récupération des données du corps de la requête
        const { email, password } = await request.json();

        // Vérification de la force du mot de passe
        const passwordValidation = isStrongPassword(password);
        if (!passwordValidation.isValid) {
            let errorMessage = 'Le mot de passe doit contenir';

            if (!passwordValidation.lengthCheck) {
                errorMessage += ' au moins 8 caractères,';
            }

            if (!passwordValidation.uppercaseCheck) {
                errorMessage += ' au moins une majuscule,';
            }

            if (!passwordValidation.lowercaseCheck) {
                errorMessage += ' au moins une minuscule,';
            }

            if (!passwordValidation.digitCheck) {
                errorMessage += ' au moins un chiffre,';
            }

            if (!passwordValidation.specialCharCheck) {
                errorMessage += ' au moins un caractère spécial';
            }
            return NextResponse.json({ message: errorMessage }, { status: 400 })
        }
        try {
            // Vérification si l'email existe déjà dans la base de données
            const existingUser = await prisma.user.findUnique({
                where: {
                    email: email
                }
            });

            if (existingUser) {
                return NextResponse.json({ message: "Cette adresse e-mail est déjà utilisée" })
            }

            // Génération du sel et hachage du mot de passe
            const salt = bcrypt.genSaltSync(10); // Génère un sel avec un facteur de coût de 10
            const hashedPassword = bcrypt.hashSync(password, salt); // Hache le mot de passe avec le sel généré

            // Création d'un nouvel utilisateur dans la base de données
            const newUser = await prisma.user.create({
                data: {
                    email, // Adresse email de l'utilisateur
                    password: hashedPassword // Mot de passe haché
                },
            });

            return NextResponse.json({ newUser }, { status: 201 })

        } catch (error) {
            return NextResponse.json({ message: "Echec de la cration d'un utilisateur", error: error.message })
        }
    }
    catch (error) {
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
    }
}