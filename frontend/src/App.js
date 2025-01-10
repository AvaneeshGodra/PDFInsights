import { useState } from 'react'
import { Header } from './components/Header'
import { ChatMessage } from './components/ChatMessage'
import { ChatInput } from './components/ChatInput'

function App() {
  const [messages, setMessages] = useState([])
  const userID='user-123'

  const handleSendMessage = async (message, isUser = true) => {
    const newMessage = {
      id: Date.now(),
      text: message,
      isUser,
    }
    setMessages((prev) => [...prev, newMessage])
  }

  return (
    <div className="flex flex-col h-screen">
      <Header userid={userID}/>
      <main className="flex-1 overflow-y-auto">
        {messages.map((message) => (
          <ChatMessage
            key={message.id}
            message={message.text}
            isUser={message.isUser}
            avatar={message.isUser ? 'S' : 'AI'}
          />
        ))}
      </main>
      <ChatInput onSendMessage={handleSendMessage} userid={userID}/>
    </div>
  )
}

export default App
