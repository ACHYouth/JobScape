import { useEffect, useState } from "react"
import Errormsg from "./Errormsg"
import Notif from "./Notif"
import jobService from "../services/jobs"
import signupService from "../services/signup"
import { useNavigate } from "react-router-dom"

const statusOptions = ["Saved", "Applied", "Interviewing", "Offer", "Rejected"]

const Homepage = ({ handleLogout, user, mes, error, token }) => {
  const [jobs, setJobs] = useState([])
  const [localError, setLocalError] = useState('')
  const [localMes, setLocalMes] = useState('')
  const [resumeFile, setResumeFile] = useState(null)
  const [resumeFileName, setResumeFileName] = useState('')
  const [showUploadForm, setShowUploadForm] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    if (token) {
      jobService.getAllJobs(token)
        .then(setJobs)
        .catch(() => {
            setLocalError("Failed to load jobs")
            setTimeout(() => setLocalError(''), 2000)
        })
    }
  }, [token])

  useEffect(() => {
    const fetchResume = async () => {
      try {
        const data = await signupService.getResumeText(token)
        if (data.resumeFileName) {
          setResumeFileName(data.resumeFileName)
        }
      } catch (err) {
        console.log("No resume uploaded yet")
      }
    }

    if (token) {
      fetchResume()
    }
  }, [token])

  const handleStatusChange = async (id, newStatus) => {
    try {
      const updatedJob = await jobService.updateJobStatus(id, newStatus)
      setJobs(jobs.map(job => job.id === id ? updatedJob : job))
      setLocalMes("Status updated")
      setTimeout(() => setLocalMes(''), 2000)
    } catch (error) {
      setLocalError("Failed to update status")
      setTimeout(() => setLocalError(''), 2000)
    }
  }

  const handleDelete = async (id) => {
    const confirm = window.confirm("Are you sure you want to delete this job?")
    if (!confirm) return

    try {
      await jobService.deleteJob(id, token)
      setJobs(jobs.filter(job => job.id !== id))
      setLocalMes("Job deleted")
      setTimeout(() => setLocalMes(''), 2000)
    } catch (error) {
      setLocalError("Failed to delete job")
      setTimeout(() => setLocalError(''), 2000)
    }
  }

  const handleResumeUpload = async (e) => {
    e.preventDefault()
    if (!resumeFile) {
      setLocalError("Please select a resume file")
      setTimeout(() => setLocalError(''), 2000)
      return
    }

    try {
      await signupService.uploadResume(resumeFile, token)
      setLocalMes("Resume uploaded successfully")
      setResumeFileName(resumeFile.name)
      setResumeFile(null)
      setShowUploadForm(false)
      setTimeout(() => setLocalMes(''), 2000)
    } catch (error) {
      setLocalError("Failed to upload resume")
      setTimeout(() => setLocalError(''), 2000)
    }
  }

  return (
    <div>
        <Errormsg message={error || localError} />
        <Notif message={mes || localMes} />

        {showUploadForm ? (
            <form onSubmit={handleResumeUpload}>
            <input
                type="file"
                accept="application/pdf"
                onChange={(e) => setResumeFile(e.target.files[0])}
            />
            <button type="submit">Upload</button>
            </form>
        ) : (
            <button onClick={() => setShowUploadForm(true)}>
            {resumeFileName ? `Resume: ${resumeFileName}` : 'Upload Resume'}
            </button>
        )}

        <p>{user.name} is logged in</p>
        <button onClick={handleLogout}>Logout</button>

        <br></br>
        <button onClick={() => navigate('/addjobapp')}>Add an Application</button>

        <br></br>
        <button onClick={() => navigate('/askassistant')}>Ask Assistant</button>



        <h2>Your Current Job Applications</h2>
        {jobs.length === 0 && <p>No jobs to display!</p>}
        {jobs.map(job => (
            <div key={job.id} style={{ border: '1px solid #ccc', margin: '1rem 0', padding: '1rem' }}>
            <p><strong>Title:</strong> {job.title}</p>
            <p><strong>Company:</strong> {job.company}</p>
            <p><strong>URL:</strong> <a href={job.url} target="_blank" rel="noopener noreferrer">{job.url}</a></p>
            <p><strong>Description:</strong> {job.desc}</p>
            <p><strong>Type:</strong> {job.type}</p>
            <p><strong>Source:</strong> {job.source}</p>
            
            <label><strong>Status:</strong>{' '}
                <select
                value={job.status}
                onChange={(e) => handleStatusChange(job.id, e.target.value)}
                >
                {statusOptions.map(status => (
                    <option key={status} value={status}>{status}</option>
                ))}
                </select>
            </label>
            <br /><br />
            <button onClick={() => handleDelete(job.id)} style={{ color: 'red' }}>Delete</button>
            </div>
        ))}
    </div>
  )
}

export default Homepage
