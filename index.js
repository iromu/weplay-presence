process.title = 'weplay-presence'

const discoveryUrl = process.env.DISCOVERY_URL || 'http://localhost:3010'
const discoveryPort = process.env.DISCOVERY_PORT || 3060

const PresenceService = require('./PresenceService')
const service = new PresenceService(discoveryUrl, discoveryPort)

require('weplay-common').cleanup(service.destroy.bind(service))
