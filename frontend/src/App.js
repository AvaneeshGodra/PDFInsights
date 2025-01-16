import { useState } from 'react'
import { Header } from './components/Header'
import { ChatMessage } from './components/ChatMessage'
import { ChatInput } from './components/ChatInput'

function App() {
  const [messages, setMessages] = useState([])
  const [userID, setUserID] = useState(null) // Initialize userID as null
  const [isUserIDSet, setIsUserIDSet] = useState(false) // To check if userID is set

  function getUserInitials(name) {
    if (!name) return 'User';
    const parts = name.split(' ');
    const initials = parts.map((part) => part.charAt(0).toUpperCase()).join('');
    return initials.slice(0, 2); // Limit to 2 characters
  }

  const handleSendMessage = async (message, isUser = true) => {
    const newMessage = {
      id: Date.now(),
      text: message,
      isUser,
    }
    setMessages((prev) => [...prev, newMessage])
  }

  const handleSetUserID = (event) => {
    event.preventDefault()
    if (userID) {
      setIsUserIDSet(true)
    }
  }

  return (
    <div className="flex flex-col h-screen">
      {!isUserIDSet ? (
        <div className="flex items-center justify-center h-screen">
          <form onSubmit={handleSetUserID} className="flex flex-col gap-4 p-4 border rounded">
            <label htmlFor="userid" className="text-lg">
              Enter your name :
            </label>
            <input
              id="userid"
              type="text"
              placeholder="Enter Your Name "
              value={userID || ''}
              onChange={(e) => setUserID(e.target.value)}
              className="p-2 border rounded"
              required
            />
            <button type="submit" className="px-4 py-2 text-white bg-blue-500 rounded">
              Submit
            </button>
          </form>
        </div>
      ) : (
        <>
          <Header userid={userID} />
          <main className="flex-1 overflow-y-auto">
            {messages.map((message) => (
              <ChatMessage
                key={message.id}
                message={message.text}
                isUser={message.isUser}
                avatar={message.isUser ? getUserInitials(userID) : 'PI'}
              />
            ))}
          </main>
          <ChatInput onSendMessage={handleSendMessage} userid={userID} />
        </>
      )}
    </div>
  )
}

export default App
