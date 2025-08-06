import { useState } from "react"
import { useNavigate } from "react-router-dom"
import jobService from "../services/jobs"
import Errormsg from "./Errormsg"
import Notif from "./Notif"

const AddJob = ({ token }) => {
  const navigate = useNavigate()

  const [title, setTitle] = useState('')
  const [company, setCompany] = useState('')
  const [url, setUrl] = useState('')
  const [desc, setDesc] = useState('')
  const [type, setType] = useState('')
  const [source, setSource] = useState('')
  const [status, setStatus] = useState('Saved')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    const newJob = { title, company, url, desc, type, source, status }

    try {
      await jobService.createJob(newJob, token)
      setSuccess("Job application added!")
      setTimeout(() => {
        navigate("/") 
      }, 1500)
    } catch (err) {
      setError("Failed to create job application")
      setTimeout(() => setError(''), 2000)
    }
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-white mt-[0px]">
      <h2 className="text-3xl font-bold text-purple-500 mb-2">Add a Job Application</h2>

      <Notif message={success} />
      <Errormsg message={error} />

      <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-[300px] mt-4">
        <div className="flex flex-col">
          <label className="text-purple-500 font-semibold mb-1">Title:</label>
          <input
            type="text"
            value={title}
            onChange={e => setTitle(e.target.value)}
            required
            className="w-full bg-transparent border-2 border-purple-500 text-white px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-700"
          />
        </div>

        <div className="flex flex-col">
          <label className="text-purple-500 font-semibold mb-1">Company:</label>
          <input
            type="text"
            value={company}
            onChange={e => setCompany(e.target.value)}
            required
            className="w-full bg-transparent border-2 border-purple-500 text-white px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-700"
          />
        </div>

        <div className="flex flex-col">
          <label className="text-purple-500 font-semibold mb-1">URL:</label>
          <input
            type="text"
            value={url}
            onChange={e => setUrl(e.target.value)}
            className="w-full bg-transparent border-2 border-purple-500 text-white px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-700"
          />
        </div>

        <div className="flex flex-col">
          <label className="text-purple-500 font-semibold mb-1">Description:</label>
          <textarea
            value={desc}
            onChange={e => setDesc(e.target.value)}
            className="w-full bg-transparent border-2 border-purple-500 text-white px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-700 resize-none"
          />
        </div>

        <div className="flex flex-col">
          <label className="text-purple-500 font-semibold mb-1">Type:</label>
          <input
            type="text"
            value={type}
            onChange={e => setType(e.target.value)}
            className="w-full bg-transparent border-2 border-purple-500 text-white px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-700"
          />
        </div>

        <div className="flex flex-col">
          <label className="text-purple-500 font-semibold mb-1">Source:</label>
          <input
            type="text"
            value={source}
            onChange={e => setSource(e.target.value)}
            className="w-full bg-transparent border-2 border-purple-500 text-white px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-700"
          />
        </div>

        <div className="flex flex-col">
          <label className="text-purple-500 font-semibold mb-1">Status:</label>
          <select
            value={status}
            onChange={e => setStatus(e.target.value)}
            className="w-full bg-black border-2 border-purple-500 text-purple px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-700"
          >
            <option value="Saved">Saved</option>
            <option value="Applied">Applied</option>
            <option value="Interviewing">Interviewing</option>
            <option value="Offer">Offer</option>
            <option value="Rejected">Rejected</option>
          </select>
        </div>

        <button
          type="submit"
          className="cursor-pointer mt-5 w-[150px] block mx-auto text-center bg-gradient-to-r from-purple-500 to-pink-500 text-white text-base font-semibold px-4 py-2 rounded-full border-2 border-black shadow-md hover:opacity-90 transition-all duration-200"
        >
          Add Job
        </button>
      </form>

      <br />

      <button
        type="button"
        onClick={() => navigate('/')}
        className="cursor-pointer mt-[-15px] w-[150px] mb-10 text-center bg-gradient-to-r from-purple-500 to-pink-500 text-white text-base font-semibold px-4 py-2 rounded-full border-2 border-black shadow-md hover:opacity-90 transition-all duration-200"
      >
        Cancel
      </button>
    </div>
  )
}

export default AddJob
