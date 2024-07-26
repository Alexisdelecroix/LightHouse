"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import style from './history.module.css';
import { jwtDecode } from 'jwt-decode';

export default function History() {
    const [userReports, setUserReports] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const router = useRouter();

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            router.push('/connexion');
            return;
        }

        try {
            // Décoder le token JWT pour obtenir ses informations (payload)
            const decodedToken = jwtDecode(token);
            // Obtenir le temps actuel en secondes (JWT utilise des timestamps en secondes)
            const currentTime = Date.now() / 1000; 
            if (decodedToken.exp <= currentTime) {
                localStorage.removeItem('token');
                router.push('/connexion'); // Rediriger vers la page de connexion si le token est expiré
                return;
            }
        } catch (error) {
            localStorage.removeItem('token');
            router.push('/connexion'); // Rediriger vers la page de connexion si le token est invalide
            return;
        }

        const fetchUserReports = async () => {
            try {
                const response = await fetch('/report/getUserReports', {
                    method: 'GET',
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });

                if (response.ok) {
                    const data = await response.json();
                    setUserReports(data.reports);
                } else {
                    console.error('Erreur lors de la récupération des rapports:', response.statusText);
                    setError('Erreur lors de la récupération des rapports');
                }
            } catch (error) {
                console.error('Erreur lors de la récupération des rapports:', error);
                setError('Erreur lors de la récupération des rapports');
            } finally {
                setLoading(false);
            }
        };

        fetchUserReports(); 
    }, [router]);

    return (
        <section className={style.section}>
            <div>
                <h1 className={style.titre}>Historique de vos rapports LightHouse</h1>
                <span className={style.line}></span>
            </div>

            <div className={style.container_report}>
                {userReports.map((report, index) => (
                    <div key={index} className={style.block_report}>
                        <div className={style.report}>
                            <p>{report.siteName}</p>
                            <p>Date: {new Date(report.createdAt).toLocaleDateString()}</p>
                            {report.pdf.map((pdf, pdfIndex) => (
                                <div key={pdfIndex}>
                                    <a href={pdf.pdfUrlDesktop} target="_blank" rel="noopener noreferrer">Télécharger PDF (Desktop)</a>
                                    <a href={pdf.pdfUrlMobile} target="_blank" rel="noopener noreferrer">Télécharger PDF (Mobile)</a>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}
