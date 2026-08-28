# GroupChat - Real-time Group Chat Application

A modern, real-time group chat web application with password-protected rooms, image sharing, and a clean UI.

## Features ✨

- **Real-time Messaging**: Instant message delivery using WebSockets (Socket.IO)
- **Group Chats**: Create and join multiple chat rooms
- **Password Protection**: Set optional passwords for private chat rooms
- **Image Sharing**: Share images directly in chat
- **Member List**: See who's currently in the room
- **Typing Indicators**: See when others are typing
- **Clean UI**: Modern, responsive interface with Tailwind CSS
- **System Messages**: Notifications when users join/leave
- **User Authentication**: Enter username before joining

## Tech Stack 🛠️

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web server
- **Socket.IO** - Real-time bidirectional communication
- **bcryptjs** - Password hashing
- **UUID** - Unique ID generation

### Frontend
- **React 18** - UI library
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **Socket.IO Client** - WebSocket client
- **Lucide React** - Icons

## Installation & Setup 🚀

### Prerequisites
- Node.js (v16+)
- npm

### 1. Clone the repository
```bash
git clone https://github.com/53649-create/group-chat-app.git
cd group-chat-app
```

### 2. Install dependencies
```bash
npm run install-all
```

This will install dependencies for both the root project and the client folder.

### 3. Configure environment variables
```bash
cp .env.example .env
```

Edit `.env` if needed (default settings should work for local development):
```
PORT=3001
CLIENT_URL=http://localhost:5173
NODE_ENV=development
```

### 4. Start the application

**Option A: Development mode (with hot reload)**
```bash
npm run dev
```
This starts both the backend server and frontend dev server concurrently.

**Option B: Production build**
```bash
npm run build
npm start
```

### 5. Access the application
- Frontend: http://localhost:5173
- Backend API: http://localhost:3001

## Usage 📝

1. **Enter Your Username**: When you first visit the app, enter a username
2. **Browse Rooms**: View all available chat rooms
3. **Create a Room**: Click "Create New Room" to make a new chat room
   - Enter room name
   - Optionally set a password
4. **Join a Room**: Click on any room to join
   - If password-protected, enter the password when prompted
5. **Chat**: 
   - Type messages and press Send
   - Share images using the image icon
   - See who's typing and when members join/leave

## Project Structure 📁

```
group-chat-app/
├── server/
│   └── index.js                 # Express server & Socket.IO setup
├── client/
│   ├── src/
│   │   ├── components/
│   │   │   ├── RoomList.jsx    # List of available rooms
│   │   │   ├── ChatRoom.jsx    # Main chat interface
│   │   │   ├── MessageList.jsx # Display messages
│   │   │   ├── MemberList.jsx  # Show room members
│   │   │   └── CreateRoomModal.jsx # Room creation form
│   │   ├── App.jsx              # Main app component
│   │   ├── index.css            # Global styles
│   │   └── main.jsx             # React entry point
│   ├── index.html               # HTML template
│   ├── vite.config.js           # Vite configuration
│   ├── tailwind.config.js       # Tailwind CSS config
│   └── package.json
├── package.json                 # Root package.json
├── .env.example                 # Environment variables template
├── .gitignore
└── README.md
```

## API Endpoints 🔌

### REST API

**GET /api/rooms**
- Get all available chat rooms
- Returns: Array of room objects

**POST /api/rooms**
- Create a new chat room
- Body: `{ name, password, createdBy }`
- Returns: Created room object

### Socket.IO Events

**Client → Server**
- `join-room`: Join a specific room
- `send-message`: Send a message to the room
- `typing`: Indicate typing status

**Server → Client**
- `load-messages`: Load previous messages
- `new-message`: New message received
- `user-joined`: User joined the room
- `user-left`: User left the room
- `update-members`: Member list updated
- `user-typing`: User typing indicator
- `error`: Error message

## Features Breakdown 💡

### Real-time Updates
All interactions use WebSockets for instant updates:
- Messages appear instantly
- User join/leave notifications
- Live member list updates
- Typing indicators

### Security
- Passwords are hashed using bcryptjs
- Password verification on room join
- Private rooms support

### Responsive Design
- Works on desktop and mobile
- Tailwind CSS responsive utilities
- Fluid layout with Flexbox

## Deployment 🌐

### Deploy to Heroku

1. Create a Heroku account and install Heroku CLI
2. Build the client:
   ```bash
   npm run build
   ```
3. Add to `.gitignore`:
   ```
   client/node_modules/
   client/.env
   ```
4. Create `Procfile`:
   ```
   web: node server/index.js
   ```
5. Push to Heroku:
   ```bash
   heroku create your-app-name
   git push heroku main
   ```

### Deploy to Vercel (Frontend) + Railway/Render (Backend)

See individual platform docs for deployment instructions.

## Troubleshooting 🔧

**Messages not appearing?**
- Check browser console for errors
- Ensure Socket.IO connection is established
- Verify backend is running on correct port

**Can't join password-protected room?**
- Ensure password is correct (case-sensitive)
- Try leaving and rejoining

**Images not uploading?**
- Check file size (keep under 5MB)
- Use supported formats (PNG, JPG, GIF)

## Future Enhancements 🚀

- [ ] User authentication & accounts
- [ ] Direct messaging
- [ ] Message history persistence (MongoDB)
- [ ] Emoji reactions
- [ ] Message search
- [ ] Room moderation tools
- [ ] Voice/video calling
- [ ] Message editing/deletion
- [ ] File sharing beyond images
- [ ] Dark mode
- [ ] User profiles with avatars

## Contributing 🤝

Feel free to fork, modify, and submit pull requests!

## License 📄

MIT License - feel free to use this project for personal or commercial purposes.

## Support 💬

Having issues? 
1. Check the troubleshooting section
2. Review the code comments
3. Create an issue on GitHub

---

**Made with ❤️ by Group Chat App Contributors**