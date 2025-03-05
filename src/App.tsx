import React, { useState, useEffect } from 'react'
import './App.css'

function App() {
  const [currentLine, setCurrentLine] = useState('')
  const [currentIndex, setCurrentIndex] = useState(0)
  const [loading, setLoading] = useState(0)
  const [downloadProgress, setDownloadProgress] = useState(0)
  const [skulls, setSkulls] = useState<Array<{ id: number, left: number, exploding: boolean }>>([])
  const [particles, setParticles] = useState<Array<{ id: number, left: number, top: number, tx: number, ty: number, r: number }>>([])
  const [explodedSkulls, setExplodedSkulls] = useState(0)
  const [combo, setCombo] = useState(0)
  const [comboText, setComboText] = useState<Array<{ id: number, text: string }>>([])
  const [skullSpeed, setSkullSpeed] = useState(8)
  const [systemInfo, setSystemInfo] = useState({
    os: 'Detectando...',
    ip: 'Detectando...',
    browser: 'Detectando...'
  })
  
  const commands = [
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
    { text: 'Sistema comprometido exitosamente', delay: 2000 },
    { text: 'Iniciando descarga de archivos...', delay: 2000 },
    { text: 'Instalando malware...', delay: 2000 },
    { text: 'Proceso completado', delay: 2000 },
    { text: 'Has sido Hackeado!!!! Estas en mi poder!!!!', delay: 3000 }
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

  useEffect(() => {
    if (currentIndex >= 14) { // Cuando llegue a "Iniciando descarga de archivos..."
      const downloadInterval = setInterval(() => {
        setDownloadProgress(prev => {
          if (prev >= 100) return 100
          return prev + 1
        })
      }, 30)

      return () => clearInterval(downloadInterval)
    }
  }, [currentIndex])

  useEffect(() => {
    if (currentIndex >= 17) { // Cuando llegue a "Proceso completado"
      const skullInterval = setInterval(() => {
        setSkulls(prev => {
          const newSkull = {
            id: Date.now(),
            left: Math.random() * 100,
            exploding: false
          }
          return [...prev, newSkull]
        })
      }, 1000)

      return () => clearInterval(skullInterval)
    }
  }, [currentIndex])

  const handleSkullClick = (skullId: number, left: number, top: number) => {
    // Marcar la calavera como explotando
    setSkulls(prev => prev.map(skull => 
      skull.id === skullId ? { ...skull, exploding: true } : skull
    ))

    // Crear partículas de explosión
    const newParticles = Array.from({ length: 12 }, (_, i) => {
      const angle = (i * 30) * Math.PI / 180
      const distance = 200
      return {
        id: Date.now() + i,
        left,
        top,
        tx: Math.cos(angle) * distance,
        ty: Math.sin(angle) * distance,
        r: Math.random() * 720
      }
    })

    setParticles(prev => [...prev, ...newParticles])

    // Actualizar contador y combo
    setExplodedSkulls(prev => prev + 1)
    setCombo(prev => {
      const newCombo = prev + 1
      if (newCombo >= 3) {
        const comboText = `${newCombo}x COMBO!`
        setComboText(prev => [...prev, { id: Date.now(), text: comboText }])
        setTimeout(() => {
          setComboText(prev => prev.filter(text => text.id !== Date.now()))
        }, 1000)
      }
      return newCombo
    })

    // Aumentar velocidad cada 5 calaveras
    if ((explodedSkulls + 1) % 5 === 0) {
      setSkullSpeed(prev => Math.max(prev - 1, 3))
    }

    // Eliminar la calavera y las partículas después de la animación
    setTimeout(() => {
      setSkulls(prev => prev.filter(skull => skull.id !== skullId))
      setParticles(prev => prev.filter(particle => !newParticles.find(p => p.id === particle.id)))
    }, 1500)
  }

  return (
    <div className="App">
      <header className="App-header">
        <h1>Bienvenido al mundo de Franastor</h1>
        {currentIndex >= 17 && (
          <div style={{ 
            marginTop: '10px', 
            fontSize: '1.2rem', 
            color: '#ff4444',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '10px'
          }}>
            <span style={{ fontSize: '1.5rem' }}>💀</span>
            <span>Calaveras explotadas: {explodedSkulls} | Combo: {combo}x</span>
          </div>
        )}
      </header>
      <div className="terminal-container">
        <div className="terminal">
          <div className="terminal-header">
            <span className="terminal-title">franastor@terminal:~$</span>
          </div>
          <div className="terminal-content">
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
            {currentIndex >= 14 && (
              <div className="download-container">
                <div className="download-bar">
                  <div className="download-progress" style={{ width: `${downloadProgress}%` }}></div>
                </div>
                <span className="download-text">Descargando archivos: {downloadProgress}%</span>
              </div>
            )}
          </div>
        </div>
      </div>
      {skulls.map(skull => (
        <div
          key={skull.id}
          className={`skull ${skull.exploding ? 'exploding' : ''}`}
          style={{ 
            left: `${skull.left}%`,
            animationDuration: `${skullSpeed}s`
          }}
          onClick={() => handleSkullClick(skull.id, skull.left, 0)}
        >
          💀
        </div>
      ))}
      {particles.map(particle => (
        <div
          key={particle.id}
          className="explosion-particle"
          style={{
            left: `${particle.left}%`,
            top: `${particle.top}%`,
            '--tx': `${particle.tx}px`,
            '--ty': `${particle.ty}px`,
            '--r': `${particle.r}deg`
          } as React.CSSProperties}
        >
          💀
        </div>
      ))}
      {comboText.map(text => (
        <div
          key={text.id}
          className="combo-text"
          style={{
            left: '50%',
            top: '50%',
            transform: 'translate(-50%, -50%)'
          }}
        >
          {text.text}
        </div>
      ))}
    </div>
  )
}

export default App
