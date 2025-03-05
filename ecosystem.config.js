module.exports = {
  apps: [{
    name: 'front-server',
    script: 'serve',
    args: ['dist', '-l', '3000'],
    env: {
      NODE_ENV: 'production',
      PORT: 3000
    },
    watch: false,
    instances: 1,
    exec_mode: 'fork',
    autorestart: true,
    max_memory_restart: '1G'
  }]
} 