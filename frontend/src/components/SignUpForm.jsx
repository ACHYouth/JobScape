import { useState } from "react"
import { useNavigate } from "react-router-dom"
import signupService from '../services/signup'
import Notif from "./Notif"
import Errormsg from "./Errormsg"

const SignUpForm = () => {
  const [username, setUsername] = useState('')
  const [name, setName] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const navigate = useNavigate()

  const handleSignUp = async (event) => {
    event.preventDefault()
    try {
      const newUser = { username, name, password }
      await signupService.addUser(newUser)
      setSuccess('Account created successfully. Please log in.')
      setTimeout(() => {
        setSuccess('')
        navigate('/login')
      }, 1500)
    } catch (err) {
      setError('Signup failed. Username is taken.')
      setTimeout(() => setError(''), 3000)
    }
  }

  const handleCancel = () => {
    navigate('/')
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-white mt-[-90px]">
      <h2 className="text-3xl font-bold text-purple-500 mb-2">Sign Up</h2>

      <Errormsg message={error} />
      <Notif message={success} />

      <form onSubmit={handleSignUp} className="flex flex-col gap-4 w-[300px] mt-4">
        <div className="flex flex-col">
          <label className="text-purple-500 font-semibold mb-1">Username:</label>
          <input
            type="text"
            value={username}
            onChange={({ target }) => setUsername(target.value)}
            required
            className="w-full bg-transparent border-2 border-purple-500 text-white px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-700"
          />
        </div>

        <div className="flex flex-col">
          <label className="text-purple-500 font-semibold mb-1">Name:</label>
          <input
            type="text"
            value={name}
            onChange={({ target }) => setName(target.value)}
            required
            className="w-full bg-transparent border-2 border-purple-500 text-white px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-700"
          />
        </div>

        <div className="flex flex-col">
          <label className="text-purple-500 font-semibold mb-1">Password:</label>
          <input
            type="password"
            value={password}
            onChange={({ target }) => setPassword(target.value)}
            required
            className="w-full bg-transparent border-2 border-purple-500 text-white px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-700"
          />
        </div>

        <button
          type="submit"
          className="cursor-pointer mt-5 w-[150px] block mx-auto text-center bg-gradient-to-r from-purple-500 to-pink-500 text-white text-base font-semibold px-4 py-2 rounded-full border-2 border-black shadow-md hover:opacity-90 transition-all duration-200"
        >
          Sign Up
        </button>
      </form>

      <br />

      <button
        onClick={handleCancel}
        className="cursor-pointer mt-[-15px] w-[150px] text-center bg-gradient-to-r from-purple-500 to-pink-500 text-white text-base font-semibold px-4 py-2 rounded-full border-2 border-black shadow-md hover:opacity-90 transition-all duration-200"
      >
        Cancel
      </button>
    </div>
  )

}

export default SignUpForm
