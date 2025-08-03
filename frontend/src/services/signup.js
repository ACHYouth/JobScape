import axios from 'axios'
const baseUrl = '/api/users'

const addUser = async user => {
    const response = await axios.post(baseUrl, user)
    return response.data
}

const getAllUsers = async () => {
  const response = await axios.get(baseUrl)
  return response.data
}

const uploadResume = async (resumeFile, token) => {
  const formData = new FormData()
  formData.append('resume', resumeFile)

  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'multipart/form-data',
    },
  }

  const response = await axios.post(`${baseUrl}/resume`, formData, config)
  return response.data
}

const getResumeText = async (token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }

  const response = await axios.get(`${baseUrl}/resume`, config)
  return response.data
}

export default {
  addUser,
  getAllUsers,
  uploadResume,
  getResumeText,
}