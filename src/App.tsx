import React, { useState, useEffect, useCallback, useRef } from 'react'
import './App.css'

function App() {
  const [currentLine, setCurrentLine] = useState('')
  const [currentIndex, setCurrentIndex] = useState(0)
  const [loading, setLoading] = useState(0)
  const [downloadProgress, setDownloadProgress] = useState(0)
  const [skulls, setSkulls] = useState<Array<{ id: number, left: number, exploding: boolean, isPirate: boolean }>>([])
  const [particles, setParticles] = useState<Array<{ id: number, left: number, top: number, tx: number, ty: number, r: number }>>([])
  const [explodedSkulls, setExplodedSkulls] = useState(0)
  const [combo, setCombo] = useState(0)
  const [comboText, setComboText] = useState<Array<{ id: number, text: string }>>([])
  const [skullSpeed, setSkullSpeed] = useState(12)
  const [maxSkulls, setMaxSkulls] = useState(3)
  const [skullSpawnInterval, setSkullSpawnInterval] = useState(1000)
  const [bombs, setBombs] = useState(0)
  const [missedSkulls, setMissedSkulls] = useState(0)
  const [gameOver, setGameOver] = useState(false)
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

  // Referencia para el contenedor de calaveras
  const skullsContainerRef = useRef<HTMLDivElement>(null)
  
  // Referencia para el último tiempo de clic
  const lastClickTimeRef = useRef(0)
  
  // Referencia para el contador de combo
  const comboTimeoutRef = useRef<ReturnType<typeof setTimeout>>()

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

  // Función para detonar todas las calaveras
  const detonateAllSkulls = useCallback(() => {
    if (bombs <= 0) return;

    // Crear partículas de explosión para cada calavera
    const newParticles = skulls.flatMap(skull => 
      Array.from({ length: 12 }, (_, i) => {
        const angle = (i * 30) * Math.PI / 180
        const distance = 200
        return {
          id: Date.now() + i + skull.id,
          left: skull.left,
          top: 0,
          tx: Math.cos(angle) * distance,
          ty: Math.sin(angle) * distance,
          r: Math.random() * 720
        }
      })
    )

    setParticles(prev => [...prev, ...newParticles])
    setSkulls([])
    setBombs(prev => prev - 1)
  }, [bombs, skulls])

  // Función optimizada para manejar clics y toques en calaveras
  const handleSkullInteraction = useCallback((skullId: number, left: number, top: number) => {
    const currentTime = Date.now()
    
    // Evitar interacciones múltiples en la misma calavera
    if (currentTime - lastClickTimeRef.current < 100) return
    lastClickTimeRef.current = currentTime

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
    const skull = skulls.find(s => s.id === skullId)
    const points = skull?.isPirate ? 5 : 1
    setExplodedSkulls(prev => prev + points)
    
    // Manejar el combo con un timeout
    setCombo(prev => {
      const newCombo = prev + 1
      
      // Limpiar el timeout anterior si existe
      if (comboTimeoutRef.current) {
        clearTimeout(comboTimeoutRef.current)
      }
      
      // Mostrar texto de combo si es >= 3
      if (newCombo >= 3) {
        const comboText = `${newCombo}x COMBO!`
        setComboText(prev => [...prev, { id: Date.now(), text: comboText }])
        
        // Aumentar dificultad basada en el combo
        if (newCombo >= 5) {
          setSkullSpeed(prev => Math.max(prev - 1, 4))
          setMaxSkulls(prev => Math.min(prev + 1, 8))
          setSkullSpawnInterval(prev => Math.max(prev - 150, 200))
        }
        
        // Eliminar el texto después de la animación
        setTimeout(() => {
          setComboText(prev => prev.filter(text => text.id !== Date.now()))
        }, 1000)
      }
      
      // Resetear el combo después de 2 segundos
      comboTimeoutRef.current = setTimeout(() => {
        setCombo(0)
      }, 2000)
      
      return newCombo
    })

    // Reducir el intervalo entre calaveras con cada calavera explotada
    setSkullSpawnInterval(prev => Math.max(prev - 50, 200))

    // Aumentar dificultad base cada 5 calaveras
    if ((explodedSkulls + points) % 5 === 0) {
      setSkullSpeed(prev => Math.max(prev - 1, 4))
      setMaxSkulls(prev => Math.min(prev + 1, 8))
      setBombs(prev => prev + 1)
    }

    // Eliminar la calavera y las partículas después de la animación
    setTimeout(() => {
      setSkulls(prev => prev.filter(skull => skull.id !== skullId))
      setParticles(prev => prev.filter(particle => !newParticles.find(p => p.id === particle.id)))
    }, 1500)
  }, [explodedSkulls, skulls])

  // Función para manejar calaveras perdidas
  const handleMissedSkull = useCallback((skullId: number) => {
    setMissedSkulls(prev => {
      const newCount = prev + 1
      if (newCount >= 10) {
        setGameOver(true)
      }
      return newCount
    })
    setSkulls(prev => prev.filter(skull => skull.id !== skullId))
  }, [])

  // Limpiar timeouts al desmontar el componente
  useEffect(() => {
    return () => {
      if (comboTimeoutRef.current) {
        clearTimeout(comboTimeoutRef.current)
      }
    }
  }, [])

  // Optimizar la creación de calaveras
  useEffect(() => {
    if (currentIndex >= 17 && !gameOver) {
      let lastSkullTime = Date.now()
      const interval = setInterval(() => {
        const currentTime = Date.now()
        // Evitar crear calaveras si la última fue hace menos del intervalo mínimo
        if (currentTime - lastSkullTime < skullSpawnInterval) return
        
        // Evitar crear más calaveras que el máximo permitido
        if (skulls.length >= maxSkulls) return
        
        setSkulls(prev => {
          const isPirate = Math.random() < 0.1 // 10% de probabilidad de calavera pirata
          const newSkull = {
            id: currentTime,
            left: Math.random() * 60 + 20, // Entre 20% y 80% del ancho
            exploding: false,
            isPirate
          }
          lastSkullTime = currentTime
          return [...prev, newSkull]
        })
      }, skullSpawnInterval)

      return () => clearInterval(interval)
    }
  }, [currentIndex, maxSkulls, skullSpawnInterval, skulls.length, gameOver])

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
            <span style={{ marginLeft: '20px', color: '#ff0000' }}>
              Calaveras perdidas: {missedSkulls}/10
            </span>
            {bombs > 0 && (
              <div 
                style={{ 
                  marginLeft: '20px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '5px'
                }}
                onClick={detonateAllSkulls}
                onTouchStart={(e) => {
                  e.preventDefault();
                  detonateAllSkulls();
                }}
              >
                <span style={{ fontSize: '1.5rem' }}>💣</span>
                <span>x{bombs}</span>
              </div>
            )}
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
      <div ref={skullsContainerRef}>
        {skulls.map(skull => (
          <div
            key={skull.id}
            className={`skull ${skull.exploding ? 'exploding' : ''}`}
            style={{ 
              left: `${skull.left}%`,
              animationDuration: `${skull.isPirate ? skullSpeed * 0.5 : skullSpeed}s`
            }}
            onClick={() => handleSkullInteraction(skull.id, skull.left, 0)}
            onTouchStart={(e) => {
              e.preventDefault();
              handleSkullInteraction(skull.id, skull.left, 0);
            }}
            onTouchEnd={(e) => {
              e.preventDefault();
            }}
          >
            {skull.isPirate ? '👨‍🦯' : '💀'}
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
      {gameOver && (
        <div style={{
          position: 'fixed',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          backgroundColor: 'rgba(0, 0, 0, 0.9)',
          padding: '2rem',
          borderRadius: '10px',
          textAlign: 'center',
          color: '#ff4444',
          zIndex: 1000
        }}>
          <h2 style={{ fontSize: '2rem', marginBottom: '1rem' }}>¡GAME OVER!</h2>
          <p style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>
            Has perdido 10 calaveras
          </p>
          <p style={{ fontSize: '1.5rem' }}>
            Puntuación final: {explodedSkulls}
          </p>
        </div>
      )}
    </div>
  )
}

export default App
