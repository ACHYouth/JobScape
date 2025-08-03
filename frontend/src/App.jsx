import { useState, useEffect } from "react"
import loginService from './services/login'
import {
  BrowserRouter as Router,
  Routes, Route, Link, Navigate
} from 'react-router-dom'
import LoginForm from "./components/LoginForm"
import Homepage from "./components/Homepage"
import Errormsg from "./components/Errormsg"
import Notif from "./components/Notif"
import SignUpForm from "./components/SignUpForm"
import AddJob from "./components/AddJob"
import ChatAssistant from "./components/ChatAssistant"

const App = () => {
  const [user, setUser] = useState(null)
  const [mes, setMes] = useState('')
  const [err, setErr] = useState('')
  const [token, setToken] = useState('')

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogAppUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      setToken(user.token)
    }
  }, [])

  const handleLogin = async (event, username, password) => {
    event.preventDefault()
    try {
      const user = await loginService.login({username, password})

      window.localStorage.setItem('loggedBlogAppUser', JSON.stringify(user))
      setToken(user.token)
      setUser(user)
      return true
    } catch (exception) {
      console.log("error with loggin in")
      setErr('Failed login: incorrect username or password')
      setTimeout(() => setErr(''), 3000)
      return false
    }
  } 

  const handleLogout = async () => {
    window.localStorage.removeItem('loggedBlogAppUser')
    setUser(null)
    setToken('')
  }

  const LoginLink = () => {
    return (
      <div>
        <h2>Sign Up or Log In!</h2>
        <Errormsg message={err} />
        <Link to="/signup">New User? (Sign Up)</Link>
        <br></br>
        <Link to="/login">Existing User? (Log in)</Link>
      </div>
    )
  }

  return (
    <Router>
      <div>
        <h1>JobScape</h1>

        <Routes>
          <Route path="/login" element={
            user
              ? <Navigate to="/" />
              : <LoginForm handleLogin={handleLogin} error={err} />
          } />

          <Route path="/signup" element={
            user
              ? <Navigate to="/" />
              : <SignUpForm />
          } />

          <Route path="/addjobapp" element={
            user
              ? <AddJob token={token} />
              : <Navigate to="/" />
          } />

          <Route path="/askassistant" element={
            user
              ? <ChatAssistant token={token} />
              : <Navigate to="/" />
          } />

          <Route path="/" element={
            user
              ? <Homepage handleLogout={handleLogout} user={user} mes={mes} error={err} token={token} />
              : <LoginLink /> 
          } />
        </Routes>
      </div>
    </Router>
  )

}

export default App
