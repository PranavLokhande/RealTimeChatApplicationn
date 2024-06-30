//           JOIN REAL-TIME CHAT APPLICATION           //

import React, { useState } from 'react';
import io from 'socket.io-client';
import { Chat } from './components/Chat';
import music from './mixkit-tile-game-reveal-960.wav';

// Socket connection to server
const socket = io.connect("http://localhost:1000");

const App = () => {
  // State for username, room, and chat visibility
  const [username, setUsername] = useState("");
  const [room, setRoom] = useState("");
  const [showChat, setShowChat] = useState(false);

  // Audio notification setup
  const notification = new Audio(music);

  // Function to join the chat room
  const joinChat = () => {
    if (username !== "" && room !== "") {
      socket.emit("join_room", room); // Emit karo room join karne ka request server ko
      setShowChat(true); // Chat dikhao
      notification.play(); // Notification sound bajao
    }
  };

  return (
    <>
      {!showChat && (
        <div className="join_room">
          <h1>Join Real-Time Chat</h1>
          <input
            type="text"
            placeholder="Enter Your Name"
            onChange={(e) => setUsername(e.target.value)} // Username change hone par update karo state
          />
          <input
            type="text"
            placeholder="Enter Chat Room"
            onChange={(e) => setRoom(e.target.value)} // Room name change hone par update karo state
          />
          <button onClick={joinChat}>Join</button> {/* Join button */}
        </div>
      )}

      {/* If chat is visible, render Chat component */}
      {showChat && (
        <Chat socket={socket} username={username} room={room} /> // Chat component ko props pass karo
      )}
    </>
  );
};

export default App;
