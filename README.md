# Chatur Chokro - Real-time Chat Application

Chatur Chokro is a modern, real-time chat application built with React, Node.js, Express, and Socket.IO. It features instant messaging, user authentication, and a responsive design for seamless communication across devices.

## ✨ Features

- 🔒 **User Authentication** - Secure signup and login with JWT
- 💬 **Real-time Messaging** - Instant message delivery with Socket.IO
- 🏠 **Room-based Chats** - Create and join different chat rooms
- 📱 **Responsive Design** - Works on desktop and mobile devices
- 🔄 **State Management** - Built with Redux Toolkit for efficient state management
- 🚀 **Modern Stack** - Built with the latest versions of React and Node.js

## 🛠️ Tech Stack

### Frontend
- React 19
- Redux Toolkit
- React Router DOM
- Socket.IO Client
- Vite (Build Tool)
- Axios (HTTP Client)

### Backend
- Node.js
- Express.js
- Socket.IO
- MongoDB with Mongoose
- JWT Authentication
- Bcrypt for password hashing

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- MongoDB Atlas account or local MongoDB installation

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/kunjjarsaniya/cohort-1-project-chat-gpt.git
   cd cohort-1-project-chat-gpt
   ```

2. **Set up the Backend**
   ```bash
   cd Backend
   npm install
   cp .env.example .env
   # Update .env with your configuration
   ```

3. **Set up the Frontend**
   ```bash
   cd ../Frontend
   npm install
   cp .env.example .env
   # Update .env with your configuration
   ```

### Running the Application

1. **Start the Backend**
   ```bash
   cd Backend
   npm run dev
   ```

2. **Start the Frontend**
   ```bash
   cd Frontend
   npm run dev
   ```

3. Open [http://localhost:5173](http://localhost:5173) in your browser

## 🔧 Environment Variables

### Backend (`.env`)
```
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
```

### Frontend (`.env`)
```
VITE_API_URL=http://localhost:5000
```

## 📂 Project Structure

```
Chatur-Chokro/
├── Backend/
│   ├── src/
│   │   ├── controllers/    # Route controllers
│   │   ├── models/        # Database models
│   │   ├── routes/        # API routes
│   │   ├── middleware/    # Custom middleware
│   │   └── server.js      # Entry point
│   └── package.json
│
└── Frontend/
    ├── public/           # Static files
    └── src/
        ├── assets/       # Images, fonts, etc.
        ├── components/   # Reusable UI components
        ├── pages/        # Page components
        ├── store/        # Redux store configuration
        └── App.jsx       # Main application component
```

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request


## 🙏 Acknowledgments

- [Socket.IO](https://socket.io/) for real-time communication
- [React](https://reactjs.org/) for the frontend framework
- [Express](https://expressjs.com/) for the backend server
- [MongoDB](https://www.mongodb.com/) for the database
