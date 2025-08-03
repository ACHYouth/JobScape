import { useState } from "react"
import chatService from "../services/chat"
import Notif from "./Notif"
import Errormsg from "./Errormsg"
import { useNavigate } from "react-router-dom"
import MessageBubble from "./MessageBubble"

const ChatAssistant = ({ token }) => {
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const handleSend = async () => {
    if (!input.trim()) return

    const newMessages = [...messages, { role: 'user', content: input }]
    setMessages(newMessages)
    setInput('')
    setLoading(true)

    try {
      const res = await chatService.sendMessageToAssistant(input, token)
      setMessages([...newMessages, { role: 'assistant', content: res.reply }])
    } catch (err) {
      setError('Failed to fetch response')
      setTimeout(() => setError(''), 3000)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ padding: '1rem' }}>
      <h2>Let Assistant Help you out!</h2>
      <Errormsg message={error} />
      <div style={{ maxHeight: '400px', overflowY: 'auto', border: '1px solid #ccc', padding: '1rem', marginBottom: '1rem' }}>
        {messages.map((msg, idx) => (
            <MessageBubble key={idx} message={msg.content} sender={msg.role} />
        ))}
        {loading && <div>Assistant is typing...</div>}
      </div>

      <textarea
        value={input}
        onChange={(e) => setInput(e.target.value)}
        rows={3}
        style={{ width: '100%', marginBottom: '0.5rem' }}
        placeholder="Ask something like 'Generate a cover letter for company XYZ'..."
      />
      <div>
        <button onClick={handleSend} disabled={loading || !input.trim()} style={{ marginRight: '0.5rem' }}>
          Send
        </button>
        <button onClick={() => navigate('/')}>Back to Homepage</button>
      </div>
    </div>
  )
}

export default ChatAssistant
