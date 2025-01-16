import { Send } from 'lucide-react';
import axios from 'axios';
import { useState } from 'react';

export function ChatInput({ onSendMessage, userid }) {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(""); // Track the message in state

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = e.currentTarget;
    const input = form.elements.namedItem('message');
    const messageText = input.value.trim();

    if (messageText) {
      const userId = userid;

      // Add user message
      onSendMessage(messageText, true);

      // Set loading state to true
      setLoading(true);

      try {
        // Send message to the backend
        const response = await axios.post(process.env.REACT_APP_CHATBOX, {
          user_id: userId,
          question: messageText,
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

      setMessage(""); // Reset message after submit
    }
  };

  const handleButtonClick = (summaryType, e) => {
    e.preventDefault(); // Prevent default form behavior
    let generatedMessage = "";
    switch (summaryType) {
      case "short":
        generatedMessage = "Generate a short summary of length 50-60 words. Highlight key points and main ideas, ensuring the summary captures essential information.";
        break;
      case "medium":
        generatedMessage = "Generate a medium-length summary. Highlight key points and main ideas, ensuring the summary captures essential information.";
        break;
      case "long":
        generatedMessage = "Generate a long summary with detailed information. Highlight key points and main ideas, ensuring the summary captures essential information.";
        break;
      default:
        generatedMessage = "";
    }
    setMessage(generatedMessage); // Set the message in state when a button is clicked
    handleSubmit(e); // Trigger form submission after setting the message
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 border-t">
      <div className="flex gap-2 mb-4">
        <button
          type="button"
          onClick={(e) => handleButtonClick("short", e)} // Pass event e here
          className="px-4 py-2 text-sm font-medium text-white bg-green-500 rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
        >
          Short
        </button>
        <button
          type="button"
          onClick={(e) => handleButtonClick("medium", e)} // Pass event e here
          className="px-4 py-2 text-sm font-medium text-white bg-yellow-500 rounded-md hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2"
        >
          Medium
        </button>
        <button
          type="button"
          onClick={(e) => handleButtonClick("long", e)} // Pass event e here
          className="px-4 py-2 text-sm font-medium text-white bg-blue-500 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Long
        </button>
      </div>
      <div className="flex gap-2">
        <input
          name="message"
          placeholder="Ask a question..."
          value={message} // Bind input value to the state
          onChange={(e) => setMessage(e.target.value)} // Handle input change
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
