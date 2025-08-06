import { useState } from "react"
import chatService from "../services/chat"
import Notif from "./Notif"
import Errormsg from "./Errormsg"
import { useNavigate } from "react-router-dom"
import MessageBubble from "./MessageBubble"
import ReactMarkdown from "react-markdown";

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
    <div className="p-6 max-w-3xl mx-auto">
      <h2 className="text-2xl font-bold text-purple-600 mb-4">Let Assistant Help You Out!</h2>
      <Errormsg message={error} />

      <div className="border border-pink-200 rounded-lg mb-4 overflow-y-auto h-96 shadow-sm bg-black text-white">
        <div className="bg-pink-100 text-pink-700 font-semibold px-4 py-2 rounded-t-lg">Jobot</div>

        <div className="px-4 py-2 space-y-3">
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`max-w-[75%] px-4 py-2 rounded-lg shadow text-sm ${msg.role === 'user' ? 'bg-purple-500 text-white' : 'bg-pink-200 text-pink-800'}`}>
                {msg.role === 'user' ? (
                  <span>{msg.content}</span>
                ) : (
                  <div className="prose prose-sm prose-pink max-w-none">
                    <ReactMarkdown >
                      {msg.content}
                    </ReactMarkdown>
                  </div>
                )}
              </div>
            </div>
          ))}
          {loading && (
            <div className="text-gray-400 italic">Jobot is typing...</div>
          )}
        </div>
      </div>


      <textarea
        value={input}
        onChange={(e) => setInput(e.target.value)}
        rows={3}
        className="w-full border-2 border-purple-500 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-purple-400 mb-4 text-white"
        placeholder="Ask something like 'Generate a cover letter for company XYZ'..."
      />

      <div className="flex gap-4">
        <button
          onClick={handleSend}
          disabled={loading || !input.trim()}
          className="w-[200px] bg-gradient-to-r from-purple-500 to-pink-500 text-white text-base font-semibold px-4 py-2 rounded-full border-2 border-black shadow-md hover:opacity-90 transition-all duration-200 disabled:opacity-50"
        >
          Send
        </button>
        <button
          onClick={() => navigate('/')}
          className="w-[200px] bg-gradient-to-r from-purple-500 to-pink-500 text-white text-base font-semibold px-4 py-2 rounded-full border-2 border-black shadow-md hover:opacity-90 transition-all duration-200"
        >
          Back to Homepage
        </button>
      </div>
    </div>
  )
}

export default ChatAssistant
