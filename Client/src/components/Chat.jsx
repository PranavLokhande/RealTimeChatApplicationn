import React, { useState, useEffect, useRef } from "react";
import music from '../iphone-sms-tone-original-mp4-5732.mp3';

export const Chat = ({ socket, username, room }) => {
  const [currentMessage, setCurrentMessage] = useState(""); // State for current message being typed
  const [messageList, setMessageList] = useState([]); // State to store list of messages

  const notification = new Audio(music); // Audio notification setup

  // Function to send a message
  const sendMessage = async () => {
    if (currentMessage !== "") {
      const messageData = {
        id: Math.random(),
        room: room,
        author: username,
        message: currentMessage,
        time:
          (new Date(Date.now()).getHours() % 12) +
          ":" +
          new Date(Date.now()).getMinutes(),
      };

      await socket.emit("send_message", messageData); // Emit message to server
      setMessageList((list) => [...list, messageData]); // Update message list with new message
      setCurrentMessage(""); // Clear current message input
      notification.play(); // Play notification sound
    }
  };

  // Effect to handle receiving messages
  useEffect(() => {
    const handleReceiveMsg = (data) => {
      setMessageList((list) => [...list, data]); // Update message list with received message
    };
    socket.on("receive_message", handleReceiveMsg); // Listen for incoming messages

    return () => {
      socket.off("receive_message", handleReceiveMsg); // Clean up event listener on unmount
    };
  }, [socket]);

  const containRef = useRef(null);

  // Effect for auto-scrolling to bottom of chat window
  useEffect(() => {
    containRef.current.scrollTop = containRef.current.scrollHeight;
  }, [messageList]);

  return (
    <>
      <div className="chat_container">
        <h1>Welcome {username}</h1>
        <div className="chat_box">
          <div
            className="auto-scrolling-div"
            ref={containRef}
            style={{
              height: "450px",
              overflowY: "auto",
              border: "2px solid yellow",
            }}
          >
            {/* Mapping through messageList to display messages */}
            {messageList.map((data) => (
              <div
                key={data.id}
                className="message_content"
                id={username === data.author ? "you" : "other"} // Conditional styling based on message author
              >
                <div>
                  <div className="msg" id={username === data.author ? "y" : "b"}>
                    <p>{data.message}</p> {/* Display message text */}
                  </div>
                  <div className="msg_detail">
                    <p>{data.author}</p> {/* Display message author */}
                    <p>{data.time}</p> {/* Display message time */}
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="chat_body">
            <input
              value={currentMessage}
              type="text"
              placeholder="Type Your Message"
              onChange={(e) => setCurrentMessage(e.target.value)} // Update current message state on input change
              onKeyPress={(e) => {
                e.key === "Enter" && sendMessage(); // Call sendMessage function on Enter key press
              }}
            />
            <button onClick={sendMessage}>&#9658;</button> {/* Button to send message */}
          </div>
        </div>
      </div>
    </>
  );
};
