const express = require('express')
const mongoose = require('mongoose')
const config = require('./utils/config')
const logger = require('./utils/logger')
const middleware = require('./utils/middleware')
const jobRouter = require('./controllers/jobs')
const userRouter = require('./controllers/users')
const loginRouter = require('./controllers/login')
const chatRouter = require('./controllers/chat')
const cors = require('cors')

const app = express()

logger.info('connecting to ', config.MONGODB_URI)

mongoose.connect(config.MONGODB_URI).then(() => {
    logger.info('connected to mongodb')
}).catch(error => {
    logger.error('error connecting to mongodb: ', error.message)
})

app.use(express.static('dist'))
app.use(express.json())
app.use(cors())
app.use(middleware.requestLogger)

app.use('/api/jobs', jobRouter)
app.use('/api/users', userRouter)
app.use('/api/login', loginRouter)
app.use('/api/chat', chatRouter)

if (process.env.NODE_ENV === 'test') {
  const testingRouter = require('./controllers/testing')
  app.use('/api/testing', testingRouter)
}

app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)

app.use((err, req, res, next) => {
  console.error(err.message)
  res.status(500).json({ error: 'Something went wrong' })
})

module.exports = app