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
    <div>
      <h2>Add a Job Application</h2>
      <Notif message={success} />
      <Errormsg message={error} />

      <form onSubmit={handleSubmit}>
        <div>Title: <input value={title} onChange={e => setTitle(e.target.value)} required /></div>
        <div>Company: <input value={company} onChange={e => setCompany(e.target.value)} required /></div>
        <div>URL: <input value={url} onChange={e => setUrl(e.target.value)} /></div>
        <div>Description: <textarea value={desc} onChange={e => setDesc(e.target.value)} /></div>
        <div>Type: <input value={type} onChange={e => setType(e.target.value)} /></div>
        <div>Source: <input value={source} onChange={e => setSource(e.target.value)} /></div>
        <div>Status:
          <select value={status} onChange={e => setStatus(e.target.value)}>
            <option value="Saved">Saved</option>
            <option value="Applied">Applied</option>
            <option value="Interviewing">Interviewing</option>
            <option value="Offer">Offer</option>
            <option value="Rejected">Rejected</option>
          </select>
        </div>
        <br />
        <button type="submit">Add Job</button>
        <button type="button" onClick={() => navigate('/')}>Cancel</button>
      </form>
    </div>
  )
}

export default AddJob
