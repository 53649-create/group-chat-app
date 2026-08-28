import { useState, useEffect } from 'react'
import RoomList from './components/RoomList'
import ChatRoom from './components/ChatRoom'
import './App.css'

function App() {
  const [currentView, setCurrentView] = useState('rooms') // 'rooms' or 'chat'
  const [selectedRoom, setSelectedRoom] = useState(null)
  const [username, setUsername] = useState('')
  const [showUsernameInput, setShowUsernameInput] = useState(true)

  const handleSelectRoom = (room) => {
    if (!username) {
      alert('Please enter a username first')
      return
    }
    setSelectedRoom(room)
    setCurrentView('chat')
  }

  const handleBackToRooms = () => {
    setCurrentView('rooms')
    setSelectedRoom(null)
  }

  const handleSetUsername = (name) => {
    if (name.trim()) {
      setUsername(name)
      setShowUsernameInput(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500">
      {showUsernameInput && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-2xl p-8 max-w-md w-full mx-4">
            <h1 className="text-3xl font-bold text-gray-800 mb-6">Welcome to GroupChat</h1>
            <input
              type="text"
              placeholder="Enter your username"
              maxLength={20}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-purple-500 mb-4"
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  handleSetUsername(e.target.value)
                }
              }}
            />
            <button
              onClick={(e) => handleSetUsername(e.target.previousElementSibling.value)}
              className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 rounded-lg transition-colors"
            >
              Continue
            </button>
          </div>
        </div>
      )}

      {currentView === 'rooms' ? (
        <RoomList username={username} onSelectRoom={handleSelectRoom} />
      ) : (
        <ChatRoom room={selectedRoom} username={username} onBack={handleBackToRooms} />
      )}
    </div>
  )
}

export default App