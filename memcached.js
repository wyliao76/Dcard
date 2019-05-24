const util = require('util')
const Memcached = require('memcached')
const memcached = new Memcached('localhost:11211', { debug: false })

const memcachedGet = util.promisify(memcached.get).bind(memcached)
const memcachedSet = util.promisify(memcached.set).bind(memcached)
const memcachedIncr = util.promisify(memcached.incr).bind(memcached)
const memcachedDel = util.promisify(memcached.del).bind(memcached)


module.exports = {
  get: memcachedGet,
  set: memcachedSet,
  incr: memcachedIncr,
  del: memcachedDel
}
