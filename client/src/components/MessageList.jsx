export default function MessageList({ messages }) {
  const formatTime = (timestamp) => {
    const date = new Date(timestamp)
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    })
  }

  return (
    <div className="space-y-3">
      {messages.map((message) => (
        <div
          key={message.id}
          className={`flex ${message.isSystemMessage ? 'justify-center' : 'justify-start'}`}
        >
          {message.isSystemMessage ? (
            <div className="bg-gray-300 bg-opacity-50 text-gray-700 text-sm px-4 py-2 rounded-full">
              {message.text}
            </div>
          ) : (
            <div className="max-w-xs lg:max-w-md bg-white rounded-lg shadow p-3 border-l-4 border-purple-500">
              <div className="flex items-baseline justify-between mb-1">
                <span className="font-bold text-gray-900 text-sm">{message.username}</span>
                <span className="text-gray-500 text-xs ml-2">{formatTime(message.timestamp)}</span>
              </div>
              {message.image && (
                <img 
                  src={message.image} 
                  alt="Shared" 
                  className="max-w-full rounded mb-2 max-h-64"
                />
              )}
              <p className="text-gray-800 text-sm break-words">{message.text}</p>
            </div>
          )}
        </div>
      ))}
    </div>
  )
}