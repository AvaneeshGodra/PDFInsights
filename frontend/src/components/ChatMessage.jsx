import ReactMarkdown from 'react-markdown';

export function ChatMessage({ message, isUser, avatar }) {
  return (
    <div className={`flex gap-4 p-4 `}>
      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${avatar === 'S' ? 'bg-pink-200' : 'bg-gray-200'}`}>
        {avatar}
      </div>
      <div
        className={`max-w-xs sm:max-w-md md:max-w-lg lg:max-w-xl xl:max-w-2xl p-3 rounded-md text-sm leading-relaxed ${isUser ? 'bg-pink-200 text-right' : 'bg-gray-200 text-left'}`}
      >
        <ReactMarkdown>{message}</ReactMarkdown>
      </div>
    </div>
  );
}
