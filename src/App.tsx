import React, { useState, useEffect } from 'react'
import './App.css'

function App() {
  const [currentLine, setCurrentLine] = useState('')
  const [currentIndex, setCurrentIndex] = useState(0)
  const [loading, setLoading] = useState(0)
  const [systemInfo, setSystemInfo] = useState({
    os: 'Detectando...',
    ip: 'Detectando...',
    browser: 'Detectando...'
  })
  
  const commands = [
    { text: 'Bienvenido al mundo franastor', delay: 100 },
    { text: 'Iniciando secuencia de acceso...', delay: 2000 },
    { text: 'Detectando sistema operativo...', delay: 2000 },
    { text: `Sistema: ${systemInfo.os}`, delay: 2000 },
    { text: 'Detectando navegador...', delay: 2000 },
    { text: `Navegador: ${systemInfo.browser}`, delay: 2000 },
    { text: 'Obteniendo dirección IP...', delay: 2000 },
    { text: `IP: ${systemInfo.ip}`, delay: 2000 },
    { text: 'Escaneando puertos...', delay: 2000 },
    { text: 'Puerto 22 (SSH) - Abierto', delay: 2000 },
    { text: 'Intentando conexión SSH...', delay: 2000 },
    { text: 'Acceso SSH concedido', delay: 2000 },
    { text: `Conectado como: franastor@${systemInfo.ip}`, delay: 2000 },
    { text: 'Acceso al sistema completado', delay: 2000 },
    { text: 'Sistema comprometido exitosamente', delay: 2000 }
  ]

  useEffect(() => {
    // Detectar sistema operativo y navegador
    const userAgent = navigator.userAgent;
    let os = 'Desconocido';
    let browser = 'Desconocido';

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
        setSystemInfo({
          os: os,
          ip: data.ip,
          browser: browser
        });
      })
      .catch(error => {
        console.error('Error al obtener la IP:', error);
        setSystemInfo(prev => ({
          ...prev,
          ip: 'No disponible'
        }));
      });

    // Actualizar info del sistema
    setSystemInfo(prev => ({
      ...prev,
      os: os,
      browser: browser
    }));
  }, []);

  useEffect(() => {
    if (currentIndex < commands.length) {
      const timer = setTimeout(() => {
        setCurrentLine(commands[currentIndex].text)
        setCurrentIndex(prev => prev + 1)
        setLoading(0)
      }, commands[currentIndex].delay)

      return () => clearTimeout(timer)
    }
  }, [currentIndex, systemInfo])

  useEffect(() => {
    if (currentIndex < commands.length && currentIndex > 0) {
      const loadingInterval = setInterval(() => {
        setLoading(prev => {
          if (prev >= 100) return 100
          return prev + 1
        })
      }, 20)

      return () => clearInterval(loadingInterval)
    }
  }, [currentIndex])

  return (
    <div className="App">
      <header className="App-header">
        <h1>Ejecutando Terminal Remoto</h1>
      </header>
      <div className="terminal-container">
        <div className="terminal">
          <div className="terminal-header">
            <span className="terminal-title">franastor@terminal:~$</span>
          </div>
          <div className="terminal-content">
            <div className="welcome-line">
              <span className="command">{commands[0].text}</span>
            </div>
            <div className="command-line">
              <span className="prompt">$</span>
              <span className="command">{currentLine}</span>
            </div>
            {currentIndex > 0 && currentIndex < commands.length && (
              <div className="loading-container">
                <div className="loading-bar">
                  <div className="loading-progress" style={{ width: `${loading}%` }}></div>
                </div>
                <span className="loading-text">{loading}%</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default App
