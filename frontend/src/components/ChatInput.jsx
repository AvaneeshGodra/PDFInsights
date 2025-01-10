import { Send } from 'lucide-react';
import axios from 'axios';
import { useState } from 'react';

export function ChatInput({ onSendMessage, userid }) {
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = e.currentTarget;
    const input = form.elements.namedItem('message');
    const message = input.value.trim();
    
    if (message) {
      const userId = userid;

      // Add user message
      onSendMessage(message, true);

      // Set loading state to true
      setLoading(true);

      try {
        // Send message to the backend
        const response = await axios.post(process.env.REACT_APP_CHATBOX, {
          user_id: userId,
          question: message,
        });

        // Add AI response
        if (response.data.answer) {
          onSendMessage(response.data.answer, false);
        }
      } catch (error) {
        console.error("Error querying PDF:", error);
        onSendMessage("Error processing your request. Please try again.", false);
      } finally {
        // Reset loading state after response
        setLoading(false);
      }

      input.value = '';
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 border-t">
      <div className="flex gap-2">
        <input
          name="message"
          placeholder="Ask a question..."
          className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        <button
          type="submit"
          className="p-2 text-white bg-blue-500 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          disabled={loading}  // Disable button when loading is true
        >
          <Send className="w-4 h-4" />
          <span className="sr-only">Send message</span>
        </button>
      </div>
    </form>
  );
}
