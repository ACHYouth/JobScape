const chatRouter = require('express').Router()
const jwt = require('jsonwebtoken')
const User = require('../models/user')
const Job = require('../models/job')
const chatWithGPT = require('../utils/chatgpt')

const getTokenFrom = request => {
  const auth = request.get('authorization')
  return auth && auth.startsWith('Bearer ') ? auth.replace('Bearer ', '') : null
}

chatRouter.post('/', async (req, res) => {
  const token = getTokenFrom(req)
  const decoded = jwt.verify(token, process.env.SECRET)
  const user = await User.findById(decoded.id)
  if (!user) return res.status(401).json({ error: 'unauthorized' })

  const { message } = req.body

  const jobs = await Job.find({ user: user._id })

  const jobListText = jobs.map((job, i) => {
    return `Job ${i + 1}:
    Title: ${job.title}
    Company: ${job.company}
    Type: ${job.type}
    Source: ${job.source}
    Status: ${job.status}
    Description: ${job.desc}\n`
  }).join('\n')

  const context = `Here is the user's resume:\n${user.resumeText}\n\nHere are the jobs the user has saved or applied to:\n\n${jobListText}`

  const messages = [
    {
      role: "system",
      content: "You are a career assistant that helps users improve resumes, generate cover letters, and conduct mock interviews based on their job applications."
    },
    {
      role: "user",
      content: `${context}\nNow, ${message}`
    }
  ]

  const gptReply = await chatWithGPT(messages)
  res.json({ reply: gptReply })
})


module.exports = chatRouter
