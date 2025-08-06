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
    <div className="px-6 pb-10">
        <Errormsg message={error || localError} />
        <Notif message={mes || localMes} />
      <div className="flex justify-between items-start px-6 mt-6">
        <div className="flex flex-col gap-3">
          {showUploadForm ? (
              <form onSubmit={handleResumeUpload} className="flex flex-col items-center gap-3">
              <input
                  type="file"
                  accept="application/pdf"
                  onChange={(e) => setResumeFile(e.target.files[0])}
                  className="block w-full text-sm text-white file:bg-purple-500 file:text-white file:font-semibold file:border-r file:border-gray-300 file:rounded-l-md file:px-4 file:py-2 file:cursor-pointer bg-gray-800 border border-purple-500 rounded-md"
              />
              <button type="submit" className="w-[200px] bg-gradient-to-r from-purple-500 to-pink-500 text-white text-base font-semibold px-4 py-2 rounded-full border-2 border-black shadow-md hover:opacity-90 transition-all duration-200 self-start">Upload Resume</button>
              </form>
          ) : (
              <button onClick={() => setShowUploadForm(true)} className="w-[350px] h-[44px] bg-gradient-to-r from-purple-500 to-pink-500 text-white text-base font-semibold px-4 py-2 rounded-full border-2 border-black shadow-md hover:opacity-90 transition-all duration-200">
              {resumeFileName ? `Resume: ${resumeFileName}` : 'Upload Resume'}
              </button>
          )}

          <br></br>
          <button onClick={() => navigate('/addjobapp')} className="w-[200px] h-[44px] mt-[-30px] bg-gradient-to-r from-purple-500 to-pink-500 text-white text-base font-semibold px-4 py-2 rounded-full border-2 border-black shadow-md hover:opacity-90 transition-all duration-200">Add an Application</button>

          <br></br>
          <button onClick={() => navigate('/askassistant')} className="w-[200px] h-[44px] mt-[-30px] bg-gradient-to-r from-purple-500 to-pink-500 text-white text-base font-semibold px-4 py-2 rounded-full border-2 border-black shadow-md hover:opacity-90 transition-all duration-200">Ask Jobot!</button>
          <br></br>
        </div>
        <div className="flex flex-col items-end gap-2 mt-[-30px]">
          <p className="text-white font-medium text-center pb-8">{user.name} is logged in</p>
          <button onClick={handleLogout} className="w-[200px] mt-[-27px] h-[44px] bg-gradient-to-r from-purple-500 to-pink-500 text-white text-base font-semibold px-4 py-2 rounded-full border-2 border-black shadow-md hover:opacity-90 transition-all duration-200">Logout</button>
        </div>
      </div>


          <h2 className="mt-10 mb-4 text-3xl font-bold text-center bg-gradient-to-r from-purple-500 to-pink-500 text-transparent bg-clip-text">Your Current Job Applications</h2>
          {jobs.length === 0 && <p className="text-center bg-gradient-to-r from-purple-500 to-pink-500 text-transparent bg-clip-text">No jobs to display!</p>}
          <div className="space-y-6">
            {jobs.map(job => (
                <div key={job.id} className="border-2 border-purple-500 rounded-xl p-5 shadow-md bg-black bg-opacity-10">
                <p className="text-purple-400 font-semibold"><strong>Title:</strong> {job.title}</p>
                <p className="text-purple-400"><strong>Company:</strong> {job.company}</p>
                <p className="text-purple-400"><strong>URL:</strong> <a href={job.url} target="_blank" rel="noopener noreferrer" className="underline hover:text-pink-400">{job.url}</a></p>
                <p className="text-purple-400"><strong>Description:</strong> {job.desc}</p>
                <p className="text-purple-400"><strong>Type:</strong> {job.type}</p>
                <p className="text-purple-400"><strong>Source:</strong> {job.source}</p>
                
                <label className="text-purple-400"><strong>Status:</strong>{' '}
                    <select
                    value={job.status}
                    onChange={(e) => handleStatusChange(job.id, e.target.value)}
                    className="ml-2 bg-black text-white border border-purple-500 rounded-md px-2 py-1"
                    >
                    {statusOptions.map(status => (
                        <option key={status} value={status}>{status}</option>
                    ))}
                    </select>
                </label>
                <br /><br />
                <div className="mt-4 flex justify-end">
                  <button onClick={() => handleDelete(job.id)} className="w-[150px] bg-gradient-to-r from-red-500 to-pink-500 text-white font-semibold px-4 py-2 rounded-full border-2 border-black shadow-md hover:opacity-90 transition-all duration-200">Delete</button>
                </div>
                </div>
            ))}
          </div>
    </div>
  )
}

export default Homepage
