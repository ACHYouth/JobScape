const jobRouter = require('express').Router()
const Job = require('../models/job')
const User = require('../models/user')
const jwt = require('jsonwebtoken')

const getTokenFrom = request => {
  const authorization = request.get('authorization')
  if (authorization && authorization.startsWith('Bearer ')) {
    return authorization.replace('Bearer ', '')
  }
  return null
}

jobRouter.get('/', async (request, response) => {
    const decodedToken = jwt.verify(getTokenFrom(request), process.env.SECRET)

    if (!decodedToken.id) {
        return response.status(401).json({ error: 'token invalid' })
    }

    const jobs = await Job.find({ user: decodedToken.id }).populate('user', { username: 1, name: 1 })
    response.json(jobs)
})


jobRouter.post('/', async (request, response) => {
    const body = request.body
    const decodedToken = jwt.verify(getTokenFrom(request), process.env.SECRET)
    if (!decodedToken.id) {
        return response.status(401).json({error: 'token invalid'})
    }
    const user = await User.findById(decodedToken.id)

    if (!user) {
        return response.status(400).json({error: 'userId missing or not valid'})
    }

    const job = new Job({
        title: body.title,
        company: body.company,
        url: body.url,
        status: body.status,
        desc: body.desc,
        type: body.type,
        source: body.source,
        user: user._id
    })

    const savedJob = await job.save()
    user.jobs = user.jobs.concat(savedJob._id)
    await user.save()
    response.status(201).json(savedJob)
})

jobRouter.delete('/:id', async (request, response) => {
  const id = request.params.id
  const decodedToken = jwt.verify(getTokenFrom(request), process.env.SECRET)

  if (!decodedToken.id) {
    return response.status(401).json({error: 'token invalid'})
  }

  const user = User.findById(decodedToken.id)

  if (!user) {
    return response.status(400).json({error: 'userId missing or not valid'})
  }

  const job = await Job.findById(id)

  if (decodedToken.id.toString() !== job.user.toString()) {
    return response.status(403).json({error: "only the creator can delete this"})
  }

  const result = await Job.findByIdAndDelete(id)
  response.status(200).end()
})

jobRouter.put('/:id', async (request, response) => {
  const id = request.params.id
  const { status } = request.body

  const job = await Job.findById(id).populate('user', { username: 1, name: 1 })
  if (!job) {
    return response.status(404).end()
  } 

  job.status = status

  const updatedJob = await job.save()
  response.json(updatedJob) 

})

module.exports = jobRouter