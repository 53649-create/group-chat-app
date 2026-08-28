import { useState, useEffect, useRef } from 'react'
import { io } from 'socket.io-client'
import { Send, ArrowLeft, Image, Users, AlertCircle } from 'lucide-react'
import MessageList from './MessageList'
import MemberList from './MemberList'

const socket = io(window.location.origin)

export default function ChatRoom({ room, username, onBack }) {
  const [messages, setMessages] = useState([])
  const [inputValue, setInputValue] = useState('')
  const [members, setMembers] = useState([])
  const [isTyping, setIsTyping] = useState(false)
  const [typingUsers, setTypingUsers] = useState(new Set())
  const [error, setError] = useState('')
  const [showMembers, setShowMembers] = useState(false)
  const messagesEndRef = useRef(null)
  const typingTimeoutRef = useRef(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  useEffect(() => {
    // Join room
    socket.emit('join-room', {
      roomId: room.id,
      username: username,
      password: room.enteredPassword || null
    })

    // Handle errors
    socket.on('error', (message) => {
      setError(message)
      setTimeout(() => setError(''), 5000)
    })

    // Load previous messages
    socket.on('load-messages', (loadedMessages) => {
      setMessages(loadedMessages)
    })

    // New message
    socket.on('new-message', (message) => {
      setMessages(prev => [...prev, message])
    })

    // User joined/left
    socket.on('user-joined', (data) => {
      setMessages(prev => [...prev, {
        id: Math.random(),
        username: '🔔 System',
        text: data.message,
        timestamp: new Date(),
        isSystemMessage: true
      }])
    })

    socket.on('user-left', (data) => {
      setMessages(prev => [...prev, {
        id: Math.random(),
        username: '🔔 System',
        text: data.message,
        timestamp: new Date(),
        isSystemMessage: true
      }])
    })

    // Update member list
    socket.on('update-members', (memberList) => {
      setMembers(memberList)
    })

    // Typing indicator
    socket.on('user-typing', (data) => {
      if (data.isTyping) {
        setTypingUsers(prev => new Set([...prev, data.username]))
      } else {
        setTypingUsers(prev => {
          const newSet = new Set(prev)
          newSet.delete(data.username)
          return newSet
        })
      }
    })

    return () => {
      socket.off('error')
      socket.off('load-messages')
      socket.off('new-message')
      socket.off('user-joined')
      socket.off('user-left')
      socket.off('update-members')
      socket.off('user-typing')
    }
  }, [room.id, username])

  const handleSendMessage = (e) => {
    e.preventDefault()

    if (!inputValue.trim()) return

    socket.emit('send-message', {
      text: inputValue,
      image: null
    })

    setInputValue('')
    socket.emit('typing', { isTyping: false })
  }

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Convert image to base64
    const reader = new FileReader()
    reader.onload = (event) => {
      const imageData = event.target?.result
      socket.emit('send-message', {
        text: '📷 Shared an image',
        image: imageData
      })
    }
    reader.readAsDataURL(file)
  }

  const handleTyping = (e) => {
    setInputValue(e.target.value)
    
    if (!isTyping) {
      setIsTyping(true)
      socket.emit('typing', { isTyping: true })
    }

    clearTimeout(typingTimeoutRef.current)
    typingTimeoutRef.current = setTimeout(() => {
      setIsTyping(false)
      socket.emit('typing', { isTyping: false })
    }, 3000)
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white p-4 shadow-lg">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={onBack}
              className="hover:bg-white hover:bg-opacity-20 rounded-lg p-2 transition-colors"
            >
              <ArrowLeft size={24} />
            </button>
            <div>
              <h2 className="text-2xl font-bold">{room.name}</h2>
              <p className="text-purple-100 text-sm">Created by {room.createdBy}</p>
            </div>
          </div>
          <button
            onClick={() => setShowMembers(!showMembers)}
            className="flex items-center gap-2 bg-white bg-opacity-20 hover:bg-opacity-30 px-4 py-2 rounded-lg transition-colors"
          >
            <Users size={20} />
            <span className="font-semibold">{members.length}</span>
          </button>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 flex items-center gap-2">
          <AlertCircle size={20} />
          {error}
        </div>
      )}

      <div className="flex-1 flex overflow-hidden">
        {/* Messages */}
        <div className="flex-1 flex flex-col">
          {/* Message List */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gradient-to-b from-gray-50 to-gray-100">
            <MessageList messages={messages} />
            {typingUsers.size > 0 && (
              <div className="text-gray-500 text-sm italic">
                {Array.from(typingUsers).join(', ')} {'is typing...'}
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="border-t border-gray-300 bg-white p-4 shadow-lg">
            <form onSubmit={handleSendMessage} className="max-w-6xl mx-auto">
              <div className="flex gap-3">
                <label className="cursor-pointer hover:bg-gray-100 p-2 rounded-lg transition-colors">
                  <Image size={24} className="text-purple-600" />
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </label>
                <input
                  type="text"
                  value={inputValue}
                  onChange={handleTyping}
                  placeholder="Type a message..."
                  className="flex-1 px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-purple-500"
                />
                <button
                  type="submit"
                  disabled={!inputValue.trim()}
                  className="bg-purple-600 hover:bg-purple-700 disabled:bg-gray-400 text-white font-bold py-3 px-6 rounded-lg transition-colors flex items-center gap-2"
                >
                  <Send size={20} />
                  Send
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Members Sidebar */}
        {showMembers && <MemberList members={members} />}
      </div>
    </div>
  )
}