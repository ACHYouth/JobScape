const bcrypt = require('bcrypt')
const userRouter = require('express').Router()
const User = require('../models/user')
const multer = require('multer')
const pdfParse = require('pdf-parse')
const fs = require('fs')
const path = require('path')
const jwt = require('jsonwebtoken')

const upload = multer({ dest: 'uploads/' })

const getTokenFrom = request => {
  const authorization = request.get('authorization')
  return authorization && authorization.startsWith('Bearer ')
    ? authorization.replace('Bearer ', '')
    : null
}

userRouter.post('/', async (request, response) => {
    const { username, name, password } = request.body

    const saltRounds = 10
    const passwordHash = await bcrypt.hash(password, saltRounds)

    const user = new User({
        username,
        name,
        passwordHash,
    })

    const savedUser = await user.save()

    response.status(201).json(savedUser)
})

userRouter.get('/', async (request, response) => {
    const users = await User.find({}).populate('jobs', { title: 1, company: 1, url: 1, status: 1, desc: 1, type: 1, source: 1 })
    response.json(users)
})

userRouter.post('/resume', upload.single('resume'), async (req, res) => {
    const token = getTokenFrom(req)
    const decodedToken = jwt.verify(token, process.env.SECRET)

    if (!decodedToken.id) {
        return res.status(401).json({ error: 'invalid token' })
    }

    const user = await User.findById(decodedToken.id)

    if (!user) {
        return response.status(400).json({error: 'userId missing or not valid'})
    }

    const file = req.file
    if (!file) return res.status(400).json({ error: 'No file uploaded' })

    const pdfBuffer = fs.readFileSync(file.path)
    const data = await pdfParse(pdfBuffer)

    user.resumeText = data.text
    user.resumeFileName = file.originalname
    await user.save()

    fs.unlinkSync(file.path)

    res.status(200).json({ message: 'Resume uploaded and processed successfully' })
})

userRouter.get('/resume', async (req, res) => {
    const token = getTokenFrom(req)
    const decodedToken = jwt.verify(token, process.env.SECRET)

    const user = await User.findById(decodedToken.id)
    if (!user) return res.status(404).json({ error: 'user not found' })

    res.json({ resumeText: user.resumeText, resumeFileName: user.resumeFileName })
})


module.exports = userRouter