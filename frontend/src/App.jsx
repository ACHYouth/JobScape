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
        <h2 className="font-bold pb-20 pt-5 text-3xl text-center bg-gradient-to-r from-purple-500 to-pink-500 text-transparent bg-clip-text">
          Sign Up or Log In!
        </h2>

        <Errormsg message={err} />

        <div className="flex flex-col items-center gap-3">
          <Link
            to="/signup"
            className="w-60 text-center bg-gradient-to-r from-purple-500 to-pink-500 text-white text-lg font-semibold px-6 py-3 rounded-full border-2 border-black shadow-md hover:opacity-90 transition-all duration-200 text-outline-black"
          >
            New User? (Sign Up)
          </Link>

          <Link
            to="/login"
            className="w-60 text-center bg-gradient-to-r from-purple-500 to-pink-500 text-white text-lg font-semibold px-6 py-3 rounded-full border-2 border-black shadow-md hover:opacity-90 transition-all duration-200 text-outline-black"
          >
            Existing User? (Log in)
          </Link>
        </div>
      </div>
    )
  }


  return (
    <Router>
      <div>
        <h1 className="font-bold p-7 text-8xl text-center bg-gradient-to-r from-purple-500 to-pink-500 text-transparent bg-clip-text">JobScape</h1>

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
