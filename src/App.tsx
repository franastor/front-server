import { useState, useEffect } from 'react'
import './App.css'

function App() {
  const [currentLine, setCurrentLine] = useState('')
  const [currentIndex, setCurrentIndex] = useState(0)
  const [loading, setLoading] = useState(0)
  
  const commands = [
    { text: 'Bienvenido al mundo franastor', delay: 100 },
    { text: 'Iniciando secuencia de acceso...', delay: 2000 },
    { text: 'Detectando sistema operativo...', delay: 2000 },
    { text: 'Sistema: macOS 24.3.0', delay: 2000 },
    { text: 'Obteniendo dirección IP...', delay: 2000 },
    { text: 'IP: 192.168.1.100', delay: 2000 },
    { text: 'Escaneando puertos...', delay: 2000 },
    { text: 'Puerto 22 (SSH) - Abierto', delay: 2000 },
    { text: 'Intentando conexión SSH...', delay: 2000 },
    { text: 'Acceso SSH concedido', delay: 2000 },
    { text: 'Conectado como: franastor@192.168.1.100', delay: 2000 },
    { text: 'Acceso al sistema completado', delay: 2000 },
    { text: 'Sistema comprometido exitosamente', delay: 2000 }
  ]

  useEffect(() => {
    if (currentIndex < commands.length) {
      const timer = setTimeout(() => {
        setCurrentLine(commands[currentIndex].text)
        setCurrentIndex(prev => prev + 1)
        setLoading(0)
      }, commands[currentIndex].delay)

      return () => clearTimeout(timer)
    }
  }, [currentIndex])

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
  )
}

export default App
