module.exports = {
  apps: [
    {
      name: 'pricepilot-scraper',
      script: './dist/index.js',
      instances: 1,
      autorestart: true,
      watch: false,
      env: {
        NODE_ENV: 'production'
      }
    }
  ]
};