module.exports = {
  apps: [{
    name: 'front-server',
    script: 'npx',
    args: 'serve -s dist -l 3000',
    env: {
      NODE_ENV: 'production'
    }
  }]
} 