import ReactMarkdown from 'react-markdown'

const MessageBubble = ({ message, sender }) => {
  const isUser = sender === 'user'

  const style = {
    backgroundColor: isUser ? '#63c6f4ff' : '#b0f065ff',
    padding: '0.5rem',
    marginBottom: '0.5rem',
    borderRadius: '8px',
    whiteSpace: 'pre-wrap',
  }

  return (
    <div style={style}>
      <strong>{isUser ? 'You' : 'Jobot'}:</strong>{' '}
      <ReactMarkdown components={{ p: 'span' }}>{message}</ReactMarkdown>
    </div>
  )
}

export default MessageBubble

