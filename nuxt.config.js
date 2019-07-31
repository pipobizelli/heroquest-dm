module.exports = {
  serverMiddleware: ['~/server/api'],
  env: {
    base_url: `https://${process.env.BASE_URL}`
  },
  plugins: [
    {
      src: '~/plugins/global.js'
    },
    {
      src: '~/plugins/client.js',
      mode: 'client'
    },
    {
      src: '~/plugins/server.js',
      mode: 'server'
    }
  ]
}
