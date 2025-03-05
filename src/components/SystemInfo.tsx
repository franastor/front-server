import React, { useEffect, useState } from 'react';

interface SystemInfo {
    ip: string;
    os: string;
    browser: string;
    userAgent: string;
}

const SystemInfo: React.FC = () => {
    const [info, setInfo] = useState<SystemInfo>({
        ip: 'Obteniendo...',
        os: 'Obteniendo...',
        browser: 'Obteniendo...',
        userAgent: 'Obteniendo...'
    });

    useEffect(() => {
        // Detectar navegador y sistema operativo
        const userAgent = navigator.userAgent;
        let browser = 'Desconocido';
        let os = 'Desconocido';

        // Detectar navegador
        if (userAgent.includes('Firefox')) browser = 'Firefox';
        else if (userAgent.includes('Chrome')) browser = 'Chrome';
        else if (userAgent.includes('Safari')) browser = 'Safari';
        else if (userAgent.includes('Edge')) browser = 'Edge';
        else if (userAgent.includes('Opera')) browser = 'Opera';
        else if (userAgent.includes('MSIE') || userAgent.includes('Trident/')) browser = 'Internet Explorer';

        // Detectar sistema operativo
        if (userAgent.includes('Windows')) os = 'Windows';
        else if (userAgent.includes('Mac')) os = 'macOS';
        else if (userAgent.includes('Linux')) os = 'Linux';
        else if (userAgent.includes('Android')) os = 'Android';
        else if (userAgent.includes('iOS')) os = 'iOS';

        // Obtener IP
        fetch('https://api.ipify.org?format=json')
            .then(response => response.json())
            .then(data => {
                setInfo({
                    ip: data.ip,
                    os: os,
                    browser: browser,
                    userAgent: userAgent
                });
            })
            .catch(error => {
                console.error('Error al obtener la IP:', error);
                setInfo(prev => ({
                    ...prev,
                    ip: 'No disponible'
                }));
            });

        // Actualizar info del sistema
        setInfo(prev => ({
            ...prev,
            os: os,
            browser: browser,
            userAgent: userAgent
        }));
    }, []);

    return (
        <div className="system-info">
            <h3>Información del Sistema</h3>
            <div className="info-grid">
                <div className="info-item">
                    <span className="label">IP:</span>
                    <span className="value">{info.ip}</span>
                </div>
                <div className="info-item">
                    <span className="label">Sistema Operativo:</span>
                    <span className="value">{info.os}</span>
                </div>
                <div className="info-item">
                    <span className="label">Navegador:</span>
                    <span className="value">{info.browser}</span>
                </div>
                <div className="info-item">
                    <span className="label">User Agent:</span>
                    <span className="value">{info.userAgent}</span>
                </div>
            </div>
        </div>
    );
};

export default SystemInfo; 