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
    <div>
      <h2>Sign Up</h2>
      <Errormsg message={error} />
      <Notif message={success} />
      <form onSubmit={handleSignUp}>
        <div>
          Username:
          <input
            type="text"
            value={username}
            onChange={({ target }) => setUsername(target.value)}
            required
          />
        </div>
        <div>
          Name:
          <input
            type="text"
            value={name}
            onChange={({ target }) => setName(target.value)}
            required
          />
        </div>
        <div>
          Password:
          <input
            type="password"
            value={password}
            onChange={({ target }) => setPassword(target.value)}
            required
          />
        </div>
        <button type="submit">Sign Up</button>
      </form>
      <br></br>
      <button onClick={handleCancel}>Cancel</button>
    </div>
  )
}

export default SignUpForm
