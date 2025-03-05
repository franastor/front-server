module.exports = {
  apps: [{
    name: 'front-server',
    script: 'serve',
    args: ['dist', '-l', '3000'],
    env: {
      NODE_ENV: 'production'
    }
  }]
} 