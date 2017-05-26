const EventBus = require('weplay-common').EventBus
const redis = require('weplay-common').redis()
require('socket.io-emitter')(redis)
const interval = process.env.WEPLAY_INTERVAL || 5000

class PresenceService {
  constructor(discoveryUrl, discoveryPort) {
    this.uuid = require('node-uuid').v4()
    this.logger = require('weplay-common').logger('weplay-presence-service', this.uuid)

    setInterval(() => {
      redis.hgetall('weplay:connections', (err, counts) => {
        if (!counts || err) {
          return
        }
        this.broadcastData(counts)
      })
    }, interval)

    this.bus = new EventBus({
      url: discoveryUrl,
      port: discoveryPort,
      name: 'presence',
      id: this.uuid
    }, () => {
      this.logger.info('PresenceService connected to discovery server', {
        discoveryUrl: discoveryUrl,
        uuid: this.uuid
      })
      this.init()
    })
  }

  init() {
    this.logger.info('PresenceService init()')
  }

  broadcastData(counts) {
    let count = 0
    for (const i in counts) {
      if (counts.hasOwnProperty(i)) {
        count += Number(counts[i])
      }
    }
    this.logger.debug('connections', count)
    redis.set('weplay:connections-total', count)
    this.bus.emit('connections', count)
  }

  destroy() {
    this.logger.info('PresenceService destroy()')
  }
}
module.exports = PresenceService