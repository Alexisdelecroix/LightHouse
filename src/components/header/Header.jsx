"use client";

import style from './header.module.css';
import Image from 'next/image';
import logo from '../../../public/images/logo.png';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';
import { useRouter } from 'next/navigation';

export default function Header() {
    const [open, setOpen] = useState(false);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const router = useRouter();

    useEffect(() => {
        // Vérifier si l'utilisateur est connecté au chargement du composant
        const token = localStorage.getItem('token');
        if (token) {
            try {
                const decodedToken = jwtDecode(token);
                const currentTime = Date.now() / 1000;
                if (decodedToken.exp > currentTime) {
                    setIsAuthenticated(true);
                } else {
                    localStorage.removeItem('token');
                    setIsAuthenticated(false);
                    router.push('/connexion'); // Rediriger vers la page de connexion si le token est expiré
                }
            } catch (error) {
                // Supprimer le token s'il n'est pas valide
                localStorage.removeItem('token');
                setIsAuthenticated(false);
                router.push('/connexion'); // Rediriger vers la page de connexion si le token est invalide
            }
        } 
    }, [router]);

    const handleLogout = () => {
        localStorage.removeItem('token');
        setIsAuthenticated(false);
        window.location.href = '/';
    };

    return (
        <>
            <header className={style.header}>
                <div>
                    <Image src={logo} alt="Logo de LightHouse" width={150} priority={true} />
                </div>
                <nav className={`${style.navigation} ${open ? style.open : ''}`}>
                    <ul className={style.list}>
                        <Link href="/" onClick={() => setOpen(false)}><li className={style.nav_item}>Accueil</li></Link>
                        {!isAuthenticated ? (
                            <Link href="/connexion" onClick={() => setOpen(false)}><li className={style.nav_item}>Connexion</li></Link>
                        ) : (
                            <>
                                <Link href="/history" onClick={() => setOpen(false)}><li className={style.nav_item}>Historique</li></Link>
                                <li className={style.nav_item} onClick={handleLogout}>Se déconnecter</li>
                            </>
                        )}
                    </ul>
                </nav>
                <div className={`${style.burger} ${open ? style.actif : ''}`} onClick={() => setOpen(!open)}>
                    <span className={style.burger_bar1}></span>
                    <span className={style.burger_bar2}></span>
                    <span className={style.burger_bar3}></span>
                </div>
            </header>
        </>
    );
}
