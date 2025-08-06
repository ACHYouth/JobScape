import { useState } from "react"
import Errormsg from "./Errormsg"
import {
  useNavigate
} from 'react-router-dom'

const LoginForm = ({ handleLogin, error }) => {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const navigate = useNavigate()

    const loginProcess = async (event) => {
        const success = await handleLogin(event, username, password)
        if (success) {
            setUsername('')
            setPassword('')
        }
    }

    const handleCancel = () => {
      navigate('/')
    }

    return (
    <div className="flex flex-col items-center justify-center min-h-screen text-white mt-[-130px]">
      <h2 className="text-3xl font-bold text-purple-500 mb-2">Log In</h2>

      <Errormsg message={error} />
      <form onSubmit={loginProcess} className="flex flex-col gap-4 w-[300px] mt-4">
        <div className="flex flex-col">
          <label className="text-purple-500 font-semibold mb-1">Username:</label>
          <input type="text" value={username} name="Username" onChange={({target}) => setUsername(target.value)} className="w-full bg-transparent border-2 border-purple-500 text-white px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-700"/>
        </div>

        <div className="flex flex-col">
          <label className="text-purple-500 font-semibold mb-1">Password:</label> 
          <input type="password" value={password} name="Password" onChange={({target}) => setPassword(target.value)} className="w-full bg-transparent border-2 border-purple-500 text-white px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-700"/>
        </div>
        <button type="submit" className="cursor-pointer mt-5 w-[150px] block mx-auto text-center bg-gradient-to-r from-purple-500 to-pink-500 text-white text-base font-semibold px-4 py-2 rounded-full border-2 border-black shadow-md hover:opacity-90 transition-all duration-200 text-outline-black">Login</button>
      </form>
      <br></br>
      <button onClick={handleCancel} className="cursor-pointer mt-[-15px] w-[150px] text-center bg-gradient-to-r from-purple-500 to-pink-500 text-white text-base font-semibold px-4 py-2 rounded-full border-2 border-black shadow-md hover:opacity-90 transition-all duration-200 text-outline-black">Cancel</button>
    </div>
    )
}

export default LoginForm