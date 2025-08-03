const mongoose = require('mongoose')

const jobSchema = mongoose.Schema({
    title: String,
    company: String,
    url: String,
    status: {
        type: String,
        enum: ["Saved", "Applied", "Interviewing", "Offer", "Rejected"]
    },
    desc: String,
    type: String,
    source: String,
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
})

jobSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
    }
})

const Job = mongoose.model('Job', jobSchema)

module.exports = Job
