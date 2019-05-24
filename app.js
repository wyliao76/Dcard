const express = require('express')
const app = express()
const mongoose = require('mongoose')
const memcached = require('./memcached')
const path = require('path')
const config = require('./config')


// load bodyParser
app.use(express.urlencoded({limit: '10mb', extended: true}))
app.use(express.json({limit: '10mb', extended: true}))

// Load view engine
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')

app.get('/', async (req, res, next) => {
  try {
    let ip = req.headers['x-real-ip'] || req.ip
    let times = await memcached.get(ip)
    if (times) {
      await memcached.incr(ip, 1)
    } else {
      await memcached.set(ip, 1, 60)
    }
    times = await memcached.get(ip)
    if (times > 60) {
      return res.status(429).json(
        {error: "Opps! You can't touch this within this minute. Come back later!"}
      )
    }
    return res.render('index', {
      times: times,
      ip: ip
    })
  } catch (err) {next(err)}
})

app.use((err, req, res, next) => {
  console.log(err)
  res.status(500).send('Internal Server Error!')
})

const port = process.env.PORT || 3000
const server = require('http').createServer(app)
// const options = {
//   useNewUrlParser: true,
//   user: config.db.user,
//   pass: config.db.pass,
//   useCreateIndex: true,
//   useFindAndModify: false,
// }

// mongoose.connect('mongodb://' + config.db.host + '/' + config.db.name, options)
// .then(() => {
//   console.log('connect successful.')
//   process.send('ready')
//   server.listen(port, () => {
//     console.log("Server running on port: " + port)
//     console.log("The environment is: " + process.env.NODE_ENV)
//   })
// })
// .catch((err) => {
//   console.log(err)
//   console.log('MongoDB connection failed')
//   process.exit(1)
// })

// process.on('SIGINT', () => {
//   console.info('SIGINT signal received.')
//   console.log('Closing http server.')
//   server.close((err) => {
//     if (err) {
//       console.error(err)
//       process.exit(1)
//     }
//     console.log('Http server closed.')
//     mongoose.connection.close(false, () => {
//       console.log('MongoDb connection closed.')
//       process.exit(0)
//     })
//   })
// })

app.listen(port, () => {
  console.log("Server running on port: " + port)
  console.log("The environment is: " + process.env.NODE_ENV)
})

module.exports = app
