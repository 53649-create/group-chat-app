import { useState, useEffect } from 'react'
import { Plus, Lock } from 'lucide-react'
import CreateRoomModal from './CreateRoomModal'

export default function RoomList({ username, onSelectRoom }) {
  const [rooms, setRooms] = useState([])
  const [showModal, setShowModal] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchRooms()
    const interval = setInterval(fetchRooms, 3000) // Refresh every 3 seconds
    return () => clearInterval(interval)
  }, [])

  const fetchRooms = async () => {
    try {
      const response = await fetch('/api/rooms')
      const data = await response.json()
      setRooms(data)
      setLoading(false)
    } catch (error) {
      console.error('Error fetching rooms:', error)
      setLoading(false)
    }
  }

  const handleRoomCreated = (newRoom) => {
    setShowModal(false)
    fetchRooms()
  }

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-white mb-2">GroupChat</h1>
          <p className="text-xl text-white text-opacity-90">Welcome, {username}!</p>
          <p className="text-white text-opacity-75">Join or create a group chat room</p>
        </div>

        {/* Create Room Button */}
        <div className="flex justify-center mb-8">
          <button
            onClick={() => setShowModal(true)}
            className="bg-white hover:bg-gray-100 text-purple-600 font-bold py-3 px-8 rounded-lg shadow-lg flex items-center gap-2 transition-all transform hover:scale-105"
          >
            <Plus size={24} />
            Create New Room
          </button>
        </div>

        {/* Modal */}
        {showModal && (
          <CreateRoomModal
            username={username}
            onClose={() => setShowModal(false)}
            onRoomCreated={handleRoomCreated}
          />
        )}

        {/* Rooms Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading ? (
            <div className="col-span-full text-center text-white text-lg">Loading rooms...</div>
          ) : rooms.length === 0 ? (
            <div className="col-span-full text-center text-white text-lg">
              No rooms yet. Create one to get started!
            </div>
          ) : (
            rooms.map(room => (
              <div
                key={room.id}
                onClick={() => {
                  if (room.isPasswordProtected) {
                    const password = prompt('Enter room password:')
                    if (password) {
                      onSelectRoom({ ...room, enteredPassword: password })
                    }
                  } else {
                    onSelectRoom(room)
                  }
                }}
                className="bg-white rounded-lg shadow-lg p-6 cursor-pointer hover:shadow-xl transition-shadow transform hover:scale-105"
              >
                <div className="flex items-start justify-between mb-4">
                  <h3 className="text-xl font-bold text-gray-800 flex-1 break-words">{room.name}</h3>
                  {room.isPasswordProtected && (
                    <Lock size={20} className="text-red-500 flex-shrink-0 ml-2" />
                  )}
                </div>
                <div className="space-y-2 text-gray-600">
                  <p className="text-sm">
                    <span className="font-semibold">Members:</span> {room.memberCount}
                  </p>
                  <p className="text-sm">
                    <span className="font-semibold">Created by:</span> {room.createdBy}
                  </p>
                  {room.isPasswordProtected && (
                    <p className="text-xs text-red-500 font-semibold">Password protected</p>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}