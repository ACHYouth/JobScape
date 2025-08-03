import axios from 'axios'

const baseUrl = '/api/jobs'

const getAllJobs = async (token) => {
  const config = {
    headers: { Authorization: `Bearer ${token}` },
  }

  const response = await axios.get(baseUrl, config)
  return response.data
}

const createJob = async (job, token) => {
  const config = {
    headers: { Authorization: `Bearer ${token}` },
  }

  const response = await axios.post(baseUrl, job, config)
  return response.data
}

const deleteJob = async (id, token) => {
  const config = {
    headers: { Authorization: `Bearer ${token}` },
  }

  await axios.delete(`${baseUrl}/${id}`, config)
}

const updateJobStatus = async (id, newStatus) => {
  const response = await axios.put(`${baseUrl}/${id}`, { status: newStatus })
  return response.data
}

export default {
  getAllJobs,
  createJob,
  deleteJob,
  updateJobStatus,
}
