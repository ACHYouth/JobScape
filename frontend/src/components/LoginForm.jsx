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
    <div>
      <Errormsg message={error} />
      <form onSubmit={loginProcess}>
        <div>
          Username: 
          <input type="text" value={username} name="Username" onChange={({target}) => setUsername(target.value)}/>
        </div>
        <div>
          Password: 
          <input type="password" value={password} name="Password" onChange={({target}) => setPassword(target.value)}/>
        </div>
        <button type="submit">Login</button>
      </form>
      <br></br>
      <button onClick={handleCancel}>Cancel</button>
    </div>
    )
}

export default LoginForm